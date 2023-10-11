const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const User = sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: Sequelize.STRING,
    name: Sequelize.STRING,
    password: Sequelize.STRING,
    isPremium: Sequelize.BOOLEAN,
    totalexpense: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    totalincome :{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})

module.exports = User;