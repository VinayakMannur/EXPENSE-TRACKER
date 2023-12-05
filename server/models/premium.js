const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const premiumSchema = new Schema({
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Premium", premiumSchema);

// const Sequelize = require('sequelize');

// const sequelize = require('../utils/database');

// const Order = sequelize.define('order',{
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     paymentId: Sequelize.STRING,
//     orderId: Sequelize.STRING,
//     status: Sequelize.STRING
// })

// module.exports = Order;
