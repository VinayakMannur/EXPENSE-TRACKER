const Expense = require('../models/expense');
const User = require('../models/user');
const { Op } = require('sequelize');
// const sequelize = require('../utils/database');

exports.addExpense = async (req, res) => {
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
            res.status(200).send({ expense: promise1, msg: "Added expense" })
        })

    } catch (error) {
        // await t.rollback();
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page, items } = req.query;
        let expenses
        let pages

        if (req.body.frequency > 0) {
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() - `${req.body.frequency}` * 24 * 60 * 60 * 1000);
            pages = await Expense.count({ where: { userId: userId, date: { [Op.between]: [endDate, startDate] } } })
            expenses = await Expense.findAll({
                offset: (page - 1) * 10,
                limit: parseInt(items),
                where: {
                    userId: userId,
                    date: { [Op.between]: [endDate, startDate] }
                }
            })
        }
        else {
            pages = await Expense.count({ where: { userId: userId } })
            expenses = await Expense.findAll({
                offset: (page - 1) * 10,
                limit: parseInt(items),
                where: { userId: userId }
            })
        }
        Promise.all([pages, expenses]).then(async () => {
            return res.status(200).send({ expenses: expenses, pages: Math.round(pages / 10) + 1 })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const { userId } = req.user;
        const { amount } = req.body;

        const promise1 = await Expense.destroy({ where: { id: req.body.id } })
        const promise2 = await User.decrement('totalexpense', { by: amount, where: { id: userId } })

        Promise.all([promise1, promise2]).then(async () => {
            return res.status(200).send({ msg: "Expense deleted" })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.editExpense = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, amount, category, description, date } = req.body;

        const editExp = await Expense.update({
            amount: amount,
            category: category,
            description: description,
            date: date,
            userId: userId
        }, {
            where: { id: id }
        })
        return res.status(200).send({ msg: "Updated Expense!!" })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}
