const Expense = require('../models/expense');
const User = require('../models/user');
const { Op } = require('sequelize');
const Download = require('../models/download')
// const sequelize = require('../utils/database');
const S3Services = require('../services/S3services')

exports.addExpense = async (req, res, next) => {
    // const t = await sequelize.transaction();

    try {

        const userId = req.user.userId;
        const { amount, category, description, date } = req.body;

        const promise1 = await Expense.create({
            amount: amount,
            category: category,
            description: description,
            date: date,
            userId: userId
        })

        const promise2 = await User.increment('totalexpense', { by: amount, where: { id: userId } })

        Promise.all([promise1, promise2]).then(async () => {
            res.json({ expense: promise1, msg: "Added expense" })
        })

    } catch (error) {
        // await t.rollback();
        console.log(error);
    }
}

exports.getExpenses = async (req, res, next) => {
    const userId = req.user.userId;
    const page = req.query.page;
    const limitItems = req.query.items;
    let expenses
    let pages

    if (req.body.frequency > 0) {

        
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() - `${req.body.frequency}` * 24 * 60 * 60 * 1000);
        pages = await Expense.count({ where: { userId: userId, date: { [Op.between]: [endDate, startDate] } } })
        expenses = await Expense.findAll({
            offset: (page -1)*10,
            limit: parseInt(limitItems),
            where: { 
                userId: userId, 
                date: { [Op.between]: [endDate, startDate] } 
            } 
        })
    }
    else {
        pages = await Expense.count({ where: { userId: userId } })
        expenses = await Expense.findAll({ 
            offset: (page -1)*10,
            limit: parseInt(limitItems),
            where: { userId: userId } 
        })
        
    }
    res.json({ expenses: expenses, pages: Math.round(pages/10)+1 })
}

exports.deleteExpense = async (req, res) => {

    try {
        const userId = req.user.userId;
        const amount = req.body.amount;

        const promise1 = await Expense.destroy({ where: { id: req.body.id } })
        const promise2 = await User.decrement('totalexpense', { by: amount, where: { id: userId } })

        Promise.all([promise1, promise2]).then(async () => {
            res.json({ msg: "Expense deleted" })
        })

    } catch (error) {
        console.log(error);
    }

}

exports.editExpense = async (req, res) => {
    const userId = req.user.userId;
    const { id, amount, category, description, date } = req.body;

    await Expense.update({
        amount: amount,
        category: category,
        description: description,
        date: date,
        userId: userId
    }, {
        where: { id: id }
    })
        .then(result => {
            res.json({ msg: "Updated expense" })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.downloadReport = async (req, res) => {
    try {
        const userId = req.user.userId;
        const date = new Date()
        let expenses = await Expense.findAll({ where: { userId: userId } })
        const stringifiedExpense = JSON.stringify(expenses);
        const filename = `Expense${userId}/${date}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpense, filename);
        await Download.create({
            URL: fileURL,
            date: date,
            userId: userId
        })
        res.json({ fileURL })

    } catch (error) {
        console.log(error);
    }
}

exports.getDownloadLinks = async (req, res) => {
    try {
        const report = await Download.findAll({ where: { userId: req.user.userId } })
        res.json(report)
    } catch (error) {
        console.log(error);
    }
}