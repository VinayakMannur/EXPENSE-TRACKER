const User = require('../models/signup');

exports.logIn = async (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findAll({where: {email:`${email}`}});
    if(user[0] === undefined){
        res.status(404).send({msg:"User doesnt Exists!!"});
    }
    else if(user[0].dataValues.email === email && user[0].dataValues.password === password){
        res.json({msg:"Login Successfull !!"});
    }
    else{
        res.status(401).send({msg:"Email Password doesnt match !!"});
    }
    
}