require("dotenv").config();
const User = require("../models/user");
const ForgotPassword = require("../models/forgotPassword");
const bcrypt = require("bcrypt");
const brevo = require("@getbrevo/brevo");
const { v4: uuidv4 } = require("uuid");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (user === null) {
      res.json({ success: false, msg: "Email Id doesnt Exists!!" });
    } else {
      const uniqueId = uuidv4();
      const URL = `http://localhost:5000/password/forgotpassword/${uniqueId}`;

      let defaultClient = brevo.ApiClient.instance;

      let apiKey = defaultClient.authentications["api-key"];
      apiKey.apiKey = process.env.FORGOT_API_KEY;

      let apiInstance = new brevo.TransactionalEmailsApi();
      let sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.subject = "{{params.subject}}";
      sendSmtpEmail.htmlContent =
        "<html><body><h1>Click on the link provided and reset your password {{params.parameter}}</h1></body></html>";
      sendSmtpEmail.sender = {
        name: "Vinayak",
        email: "vinayakmannur20@gmail.com",
      };
      sendSmtpEmail.to = [{ email: `${email}`, name: "Name" }];
      sendSmtpEmail.replyTo = {
        email: "vinayakmannur20@gmail.com",
        name: "Vinayak",
      };
      sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
      sendSmtpEmail.params = {
        parameter: `${URL}`,
        subject: "Hyy There!! Here's Your Link to Reset Your Password",
      };

      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      const forgotpmodel = new ForgotPassword({
        id: uniqueId,
        userId: user._id,
        isActive: true,
      })
      forgotpmodel.save()
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
      return res
        .status(200)
        .send({ msg: "Reset Password Link has been sent to your mail" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};

exports.resetLink = async (req, res) => {
  res.redirect("http://localhost:5000/updatepassword");
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const getUserId = await User.findOne({ email: email });

    const updPassword = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hash } },
      { new: true }
    );
    const isActiveStatus = await ForgotPassword.updateMany(
      { userId: getUserId._id },
      { $set: {isActive: false}},
    );
    if (isActiveStatus.modifiedCount > 0) {
        return res.status(200).send({ msg: "Password Updated Successfully!!!" });
    }
    else{
        return res.status(400).send({ msg: "Password not updated!!!" });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};
