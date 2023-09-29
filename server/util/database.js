const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense-tracker', 'root', 'Vinz@#$200120',{
    dialect: "mysql",
    host: "localhost"
})

module.exports = sequelize;