const User = require('../models/user');
const ForgotPasswordModel = require('../models/forgotPasswordRequests')
const bcrypt = require('bcrypt');
const brevo = require('@getbrevo/brevo');
const { v4: uuidv4 } = require('uuid');
// const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res, next) => {


    const emailId = req.body.email;

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user === null) {
        res.json({ success: false, msg: "Email Id doesnt Exists!!" })
    }
    else {
        console.log(user.dataValues.id);

        const uniqueId = uuidv4()
        const URL = `http://localhost:5000/password/forgotpassword/${uniqueId}`

        let defaultClient = brevo.ApiClient.instance;

        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = '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';

        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = "{{params.subject}}";
        sendSmtpEmail.htmlContent = "<html><body><h1>Click on the link provided and reset your password {{params.parameter}}</h1></body></html>";
        sendSmtpEmail.sender = { "name": "Vinayak", "email": "vinayakmannur20@gmail.com" };
        sendSmtpEmail.to = [
            { "email": `${emailId}`, "name": "Name" }
        ];
        sendSmtpEmail.replyTo = { "email": "vinayakmannur20@gmail.com", "name": "Vinayak" };
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        sendSmtpEmail.params = { "parameter": `${URL}`, "subject": "Hyy There!! Here's Your Link to Reset Your Password" };


        apiInstance.sendTransacEmail(sendSmtpEmail).then(async (data)=> {
            await ForgotPasswordModel.create({
                id: uniqueId,
                userId: user.dataValues.id,
                isactive: true
            })
            .then(()=>{
                console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                res.json({msg:"Reset Password Link has been sent to your mail"})
            })
        }, function (error) {
            console.error(error);
        });





    }



}

exports.resetLink = async (req, res, next) =>{
    res.redirect('http://localhost:3000/updatepassword')
}

exports.updatePassword = async (req, res, next) => {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
   
    const getUserId = await User.findOne({ where: { email: req.body.email } })

    const updPassword = await User.update({ password: hash }, { where: { email: email }})
    const isActiveStatus = await ForgotPasswordModel.update({
        isactive: false
    },{
        where:{userId:getUserId.dataValues.id}
    })
    Promise.all([updPassword, isActiveStatus]).then(()=>{
        res.json({msg:"Password Updated Successfully!!!"})
    })
}