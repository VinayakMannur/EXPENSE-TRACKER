const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Signup = sequelize.define('signup',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: Sequelize.STRING,
    name: Sequelize.STRING,
    password: Sequelize.STRING
})

module.exports = Signup;