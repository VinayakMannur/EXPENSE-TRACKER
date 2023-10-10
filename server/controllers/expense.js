const Expense = require('../models/expense');
const User = require('../models/user');
const { Op } = require('sequelize');
// const sequelize = require('../utils/database');

exports.addExpense = async (req, res, next) => {
    // const t = await sequelize.transaction();

    try {

        const userId = req.user.userId;
        const {amount, category, description, date} = req.body;

        const promise1 = await Expense.create({
            amount: amount,
            category: category,
            description: description,
            date: date,
            userId: userId
        })

        const promise2 = await User.increment('totalexpense', {by : amount, where:{id: userId}})

        Promise.all([promise1, promise2]).then(async()=>{
            res.json({expense: promise1, msg: "Added expense"})
        })

    } catch (error) {
        // await t.rollback();
        console.log(error);
    }
}

exports.getExpenses = async (req, res, next) =>{
    const userId = req.user.userId;

    let expenses
    
    if(req.body.frequency > 0){
        const startDate = new Date();
        const endDate = new Date(startDate. getTime() - `${req.body.frequency}` * 24 * 60 * 60 * 1000);
        expenses = await Expense.findAll({where: {userId: userId, date : {[Op.between] : [endDate, startDate]}}})
    }
    else{
        expenses = await Expense.findAll({where: {userId: userId}})
    }
    res.json(expenses)
}

exports.deleteExpense = async (req, res) =>{

    try {
        const userId = req.user.userId;
        const amount = req.body.amount;

        const promise1 = await Expense.destroy({where:{id: req.body.id}})
        const promise2 = await User.decrement('totalexpense', {by : amount, where:{id: userId}})

        Promise.all([promise1, promise2]).then(async()=>{
            res.json({msg: "Expense deleted"})
        })

    } catch (error) {
        console.log(error);
    }

}

exports.editExpense = async (req, res )=>{
    const userId = req.user.userId;
    const {id, amount, category, description, date} = req.body;

    await Expense.update({
        amount: amount,
        category: category,
        description: description,
        date: date,
        userId: userId
    },{
        where: {id: id}
    })
        .then(result => {
            res.json({msg: "Updated expense"})
        })
        .catch(err => {
            console.log(err);
        })
}