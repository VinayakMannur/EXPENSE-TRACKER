const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const sequelize = require('../utils/database');
const Expense = require('../models/expense')

exports.buyPremium = async (req, res, next) => {
    const userId = req.user.userId

    try {
        var rzp = new Razorpay({
            key_id: "rzp_test_1M7fCK6jDwGZbY",
            key_secret: "hfJ6ZClJY3CiCbaGF9optK2d",
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
                    // console.log(order);
                })
                .catch(err => console.log(err))
        })

    } catch (error) {
        console.log(error);
    }
}

exports.updateStatus = async (req, res, next) => {
    try {
        const { orderId, paymentId, status } = req.body;
        const userId = req.user.userId

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

exports.leaderBoard = async (req, res, next) => {
    try {
        const leaderboardOfUsers = await User.findAll({
            attributes: ['id', 'name', 'expenseamount'],
            order: [[('total_cost'), "DESC"]]
        })
        res.json(leaderboardOfUsers)
    } catch (error) {
        console.log(error);
    }
}