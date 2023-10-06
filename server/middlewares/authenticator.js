var jwt = require('jsonwebtoken');

const JWT_SECRET = 'hg'//;

const authenticate = (req, res, next) => {
    const token = req.header('authToken')
    if(!token){
        res.status(401).send({msg:"Please authenticate using valid token"});
    }
    
    const data = jwt.verify(token, JWT_SECRET);
    try {
        if(data){
            req.user = data.user
            next()
        }
        else{
            res.status(401).send({msg:"Please authenticate using valid token"});
        }
    } catch (error) {
        res.status(401).send({msg:"Please authenticate using valid token"});
    }
}

module.exports = authenticate;