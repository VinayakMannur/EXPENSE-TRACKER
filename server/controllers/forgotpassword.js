require('dotenv').config()
const User = require('../models/user');
const ForgotPasswordModel = require('../models/forgotPasswordRequests')
const bcrypt = require('bcrypt');
const brevo = require('@getbrevo/brevo');
const { v4: uuidv4 } = require('uuid');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email: email } })

        if (user === null) {
            res.json({ success: false, msg: "Email Id doesnt Exists!!" })
        }
        else {
            const uniqueId = uuidv4()
            const URL = `http://localhost:5000/password/forgotpassword/${uniqueId}`

            let defaultClient = brevo.ApiClient.instance;

            let apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = process.env.FORGOT_API_KEY;

            let apiInstance = new brevo.TransactionalEmailsApi();
            let sendSmtpEmail = new brevo.SendSmtpEmail();

            sendSmtpEmail.subject = "{{params.subject}}";
            sendSmtpEmail.htmlContent = "<html><body><h1>Click on the link provided and reset your password {{params.parameter}}</h1></body></html>";
            sendSmtpEmail.sender = { "name": "Vinayak", "email": "vinayakmannur20@gmail.com" };
            sendSmtpEmail.to = [
                { "email": `${email}`, "name": "Name" }
            ];
            sendSmtpEmail.replyTo = { "email": "vinayakmannur20@gmail.com", "name": "Vinayak" };
            sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
            sendSmtpEmail.params = { "parameter": `${URL}`, "subject": "Hyy There!! Here's Your Link to Reset Your Password" };

            const data = await apiInstance.sendTransacEmail(sendSmtpEmail)
            const forgotpmodel = await ForgotPasswordModel.create({
                id: uniqueId,
                userId: user.dataValues.id,
                isactive: true
            })
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            return res.status(200).send({ msg: "Reset Password Link has been sent to your mail" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.resetLink = async (req, res) => {
    res.redirect('http://localhost:3000/updatepassword')
}

exports.updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const getUserId = await User.findOne({ where: { email: email } })

        const updPassword = await User.update({ password: hash }, { where: { email: email } })
        const isActiveStatus = await ForgotPasswordModel.update({
            isactive: false
        }, {
            where: { userId: getUserId.dataValues.id }
        })
        Promise.all([updPassword, isActiveStatus]).then(() => {
            return res.status(200).send({ msg: "Password Updated Successfully!!!" })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }

}