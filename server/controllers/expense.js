const Expense = require('../models/expense');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.addExpense = async (req, res, next) => {
    const userId = req.user.userId;
    const {amount, category, description, date} = req.body;

    await Expense.create({
        amount: amount,
        category: category,
        description: description,
        date: date,
        userId: userId
    })
        .then(result => {
            res.json({expense: result, msg: "Added expense"})
        })
        .catch(err => {
            console.log(err);
        })
    
    // await User.increment({age: 5}, { where: { id: 1 } })
    const update = await User.increment('totalexpense', {by : amount, where:{id: userId}})
}

exports.getExpenses = async (req, res, next) =>{
    const userId = req.user.userId;
    // console.log('user i=>>>>>>>>>>>>>>>>>>>>>',userId);
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
    await Expense.destroy({where:{id: req.body.id}})
        .then((result)=>{
            res.json({msg: "Expense deleted"})
        })
        .catch(err => {
            console.log(err);
        })
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