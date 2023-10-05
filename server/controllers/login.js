const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.logIn = async (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findAll({where: {email:`${email}`}});
    let result = false;
    
    if(user.length>0){
        result = await bcrypt.compare(password, user[0].dataValues.password)
    }

    if(user[0] === undefined){
        return res.status(404).send({msg:"User doesnt Exists!!"});
    }
    else if(user[0].dataValues.email === email && result){
        res.json({user:user[0].dataValues, msg:"Login Successfull !!"});
    }
    else{
        return res.status(401).send({msg:"Email Password doesnt match !!"});
    }
    
}