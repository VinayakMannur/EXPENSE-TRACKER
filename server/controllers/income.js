const Income = require('../models/income');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.addIncome = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount, description, date } = req.body;

        const promise1 = await Income.create({
            amount: amount,
            description: description,
            date: date,
            userId: userId
        })

        const promise2 = await User.increment('totalincome', { by: amount, where: { id: userId } })

        Promise.all([promise1, promise2]).then(async () => {
            return res.status(200).send({ expense: promise1, msg: "Added income" })
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.getIncome = async (req, res) => {
    try {
        const {userId} = req.user;
        const {frequency} = req.body;
        let income

        if (frequency > 0) {
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() - `${frequency}` * 24 * 60 * 60 * 1000);
            income = await Income.findAll({ where: { userId: userId, date: { [Op.between]: [endDate, startDate] } } })
        }
        else {
            income = await Income.findAll({ where: { userId: userId } })
        }
        return res.status(200).send({income})
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}