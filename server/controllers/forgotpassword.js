const User = require('../models/user');
const bcrypt = require('bcrypt');
// const nodemailer = require("nodemailer");

exports.forgotPassword = async(req, res, next)=>{

    // const transporter = await nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'kris.ebert@ethereal.email',
    //         pass: 'FX77Dw7t4BE3Tq5ZQE'
    //     }
    // });
       
    // const info = await transporter.sendMail({
    //     from: '"Vinayak 👻" <foo@example.com>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    const user = await User.findOne({ where: {email: req.body.email}})
    if(user === null){
        res.json({success: false, msg: "Email Id doesnt Exists!!"})
    }
    else{
        res.json({success:true})
    } 
}

exports.updatePassword = async(req, res, next)=>{
    const {email, password} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    User.update({
        password: hash
    },{
        where:{email: email}
    })
        .then(()=>{
            res.json({msg: "Password Updated!!"})
        })
        .catch(err => console.log(err))
}