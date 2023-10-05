const Expense = require('../models/expense');
const { Op } = require('sequelize');

exports.addExpense = async (req, res, next) => {
    const userId = req.params.userId;
    const {amount, category, description, date} = req.body;

    Expense.create({
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
}

exports.getExpenses = async (req, res, next) =>{
    const userId = req.params.userId;
    let expenses
    
    if(req.body.frequency > 0){
        const startDate = new Date();
        const endDate = new Date(startDate. getTime() - `${req.body.frequency}` * 24 * 60 * 60 * 1000);
        expenses = await Expense.findAll({where: {userId: userId, date : {[Op.between] : [endDate , startDate ]}}})
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
    const userId = req.params.userId;
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