const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {

    try {
        const {email, name, password} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email,
            name: name,
            password: hash,
            isPremium: false
        })
        newUser.save()
            .then(result => {
                return res.status(201).send({ user: result, msg: "Sign Up SUCCESSFUL" })
            })
            .catch(err => {
                res.json({ msg: "User already Exists" })
            })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}
