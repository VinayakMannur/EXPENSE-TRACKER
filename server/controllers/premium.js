require("dotenv").config();
const Razorpay = require("razorpay");
const Premium = require("../models/premium");
const User = require("../models/user");

exports.buyPremium = async (req, res) => {
  try {
    const { userId } = req.user;

    var rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });

    const amount = 5000;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log(err);
      }
      // console.log(order);
      const premiumBuying = new Premium({
        orderId: order.id,
        status: "PENDING",
        userId: userId,
      });
      premiumBuying
        .save()
        .then((result) => {
          // console.log(result);
          return res.status(201).send({ order, key_id: rzp.key_id });
        })
        .catch((err) => console.log(err));
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { orderId, paymentId, status } = req.body;
    const { userId } = req.user;

    const filter = { orderId: orderId };
    const update = { paymentId: paymentId, status: status };

    const result = await Premium.updateOne(filter, update);

    let statusUpdate;

    if (status === "SUCCESS") {
      statusUpdate = await User.updateOne({ _id: userId }, { isPremium: true });
    } else {
      statusUpdate = await User.updateOne(
        { _id: userId },
        { isPremium: false }
      );
    }

    await Promise.all([result, statusUpdate]);

    if (result.modifiedCount > 0) {
      if (status === "SUCCESS") {
        return res
          .status(202)
          .send({ success: true, msg: "Transaction Successful" });
      } else {
        return res
          .status(202)
          .send({ success: false, msg: "Transaction Not Successful" });
      }
    } else {
      return res.status(404).send({ msg: "Order not found or not authorized" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.leaderBoard = async (req, res) => {
  try {
    const leaderboardOfUsers = await User.find({})
      .sort({ totalexpense: -1 })
      .select("_id name totalexpense");
      
    return res.status(201).send({ leaderboardData: leaderboardOfUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};
