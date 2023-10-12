const Income = require('../models/income');
const Expense = require('../models/expense')
const User = require('../models/user');
const { Op } = require('sequelize');

exports.addIncome = async (req, res, next) => {

    try {
        const userId = req.user.userId;
        const {amount, description, date} = req.body;

        const promise1 = await Income.create({
            amount: amount,
            description: description,
            date: date,
            userId: userId
        })

        const promise2 = await User.increment('totalincome', {by : amount, where:{id: userId}})

        Promise.all([promise1, promise2]).then(async()=>{
            res.json({expense: promise1, msg: "Added income"})
        })

    } catch( error ){
        console.log(error);
    }
}

exports.getIncome = async (req, res, next) =>{
    const userId = req.user.userId;

    let income
    
    if(req.body.frequency > 0){
        const startDate = new Date();
        const endDate = new Date(startDate. getTime() - `${req.body.frequency}` * 24 * 60 * 60 * 1000);
        income = await Income.findAll({where: {userId: userId, date : {[Op.between] : [endDate, startDate]}}})
    }
    else{
        income = await Income.findAll({where: {userId: userId}})
    }
    res.json(income)

}