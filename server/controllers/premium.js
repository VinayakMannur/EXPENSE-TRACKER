require('dotenv').config()
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');

exports.buyPremium = async (req, res) => {
    try {
        const {userId} = req.user;

        var rzp = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        const amount = 5000;

        rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
            if (err) {
                console.log(err);
            }
            console.log(order);
            Order.create({
                orderId: order.id,
                status: 'PENDING',
                userId: userId
            })
                .then((result) => {
                    // console.log(result);
                    return res.status(201).send({ order, key_id: rzp.key_id })
                })
                .catch(err => console.log(err))
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { orderId, paymentId, status } = req.body;
        const {userId} = req.user;

        const order = await Order.findOne({ where: { orderId: orderId } })
        const promise1 = order.update({ paymentId: paymentId, status: status })

        if(status ===  "SUCCESS"){
            const promise2 = User.update({ isPremium: true },{ where: { id: userId }})
            Promise.all([promise1, promise2]).then(()=>{
                return res.status(202).send({ success: true, msg: "Transaction Successful" })
            })
        }
        else{
            const promise2 = User.update({ isPremium: false },{ where: { id: userId }})
            Promise.all([promise1, promise2]).then(()=>{
                return res.json({ success: false, msg: "Transaction Not Successful" })
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.leaderBoard = async (req, res) => {
    try {
        const leaderboardOfUsers = await User.findAll({
            attributes: ['id', 'name', 'totalexpense'],
            order: [['totalexpense', 'DESC']]
        })
        const leaderboardData = [];
        leaderboardOfUsers.forEach(singleuser => {
            leaderboardData.push(singleuser.dataValues)
        });
        return res.status(201).send({leaderboardData})

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}