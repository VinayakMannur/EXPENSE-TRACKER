const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const ForgotPassword = sequelize.define('forgotpassword',{
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    userId: Sequelize.INTEGER,
    isactive: Sequelize.BOOLEAN
})

module.exports = ForgotPassword;