const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const downloadSchema = new Schema({
  URL: {
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

module.exports = mongoose.model("Download", downloadSchema);


// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const Download  = sequelize.define('download',{
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     URL:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     date:{
//         type: Sequelize.DATE,
//         allowNull: false
//     }
// })

// module.exports = Download;