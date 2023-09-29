const Signup = require('../models/signup');

exports.signUp = (req, res, next) =>{
    const email= req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    
    Signup.create({
        email: email,
        name: name,
        password: password
    })
        .then(result => {
            res.send(result)
        })
        .catch(err => console.log(err))
}
