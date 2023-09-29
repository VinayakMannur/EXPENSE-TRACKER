const User = require('../models/signup');

exports.signUp = async (req, res, next) =>{
    const email= req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    
    const findingEmail =  await User.findOne({where: {email: `${email}`}});
    if(findingEmail === null){
        User.create({
            email: email,
            name: name,
            password: password
        })
            .then(result => {
                res.json({msg: "Sign Up SUCCESSFUL"})
            })
            .catch(err => console.log(err))
    }
    else{
        res.json({msg:"User already Exists"})
    }


}
