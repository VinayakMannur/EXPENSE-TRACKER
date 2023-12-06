const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean
  },
});

module.exports = mongoose.model("ForgotPassword", forgotPasswordSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const ForgotPassword = sequelize.define('forgotpassword',{
//     id: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         primaryKey: true
//     },
//     userId: Sequelize.INTEGER,
//     isactive: Sequelize.BOOLEAN
// })

// module.exports = ForgotPassword;
