const Income = require('../models/income');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.addIncome = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { amount, description, date } = req.body;

        const newIncome = new Income({
            amount: amount,
            description: description,
            date: date,
            userId: userId
        })
        newIncome.save()

        await User.findByIdAndUpdate(userId, { $inc: { totalincome: amount } });
        return res.status(200).send({  msg: "Added income" })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.getIncome = async (req, res) => {
    try {
        const {userId} = req.user;
        const {frequency} = req.body;

        const startDate = new Date();
        let dateFilter = { userId: userId };

        if (frequency > 0) {
            const endDate = new Date(startDate.getTime() - `${frequency}` * 24 * 60 * 60 * 1000);
            dateFilter.date = { $gte: endDate, $lte: startDate };
        }
        
        const income = await Income.find(dateFilter)
        return res.status(200).send({income})
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}