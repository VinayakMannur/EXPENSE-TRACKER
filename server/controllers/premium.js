const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user')

exports.buyPremium = async (req, res, next) =>{
    const userId = req.user.userId

    try {
        var rzp = new Razorpay({
            key_id: "rzp_test_1M7fCK6jDwGZbY",
            key_secret: "hfJ6ZClJY3CiCbaGF9optK2d",
        });

        const amount = 5000;
        
        rzp.orders.create({amount, currency: 'INR'}, (err, order) => {
            if(err){
                console.log(err);
            }
            console.log(order);
            Order.create({
                orderId: order.id, 
                status: 'PENDING',
                userId: userId
            })
                .then((result)=>{
                    // console.log(result);
                    return res.status(201).send({order, key_id: rzp.key_id})
                    // console.log(order);
                })
                .catch(err => console.log(err))
        })

    } catch (error) {
        console.log(error);
    }
}

exports.updateStatus = async(req, res, next) =>{

    const {orderId, paymentId, status} = req.body;
    const userId = req.user.userId

    Order.findOne({
        where:{orderId: orderId}
    })
    .then((order)=>{
        order.update({
            paymentId: paymentId,
            status: status
        })
        .then(()=>{
            if(status === "SUCCESS"){
                User.update({
                    isPremium: true
                },{
                    where: {id: userId}
                })
                .then(()=>{
                    return res.status(202).send({success: true, msg: "Transaction Successful"})
                    // console.log(user);
                })
                .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
    })
    .catch(err =>console.log(err))
}