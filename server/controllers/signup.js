const User = require('../models/signup');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res, next) =>{
    const email= req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    User.create({
        email: email,
        name: name,
        password: hash
    })
        .then(result => {
            res.json({msg: "Sign Up SUCCESSFUL"})
        })
        .catch(err => {
            // console.log(err);
            res.json({msg:"User already Exists"})
        })

}
