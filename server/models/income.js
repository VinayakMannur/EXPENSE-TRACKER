const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Income", incomeSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const Income  = sequelize.define('income',{
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     amount: {
//         type: Sequelize.INTEGER,
//         allowNull: false
//     },
//     description:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     date:{
//         type: Sequelize.DATE,
//         allowNull: false
//     }
// })

// module.exports = Income;