const Expense = require("../models/expense");
const User = require("../models/user");

exports.addExpense = async (req, res) => {
  // const t = await sequelize.transaction();
  try {
    const userId = req.user.userId;
    const { amount, category, description, date } = req.body;

    const newExpense = new Expense({
      amount: amount,
      category: category,
      description: description,
      date: date,
      userId: userId,
    });
    newExpense.save();

    await User.findByIdAndUpdate(userId, { $inc: { totalexpense: amount } });

    res.status(200).send({ msg: "Added expense" });
  } catch (error) {
    // await t.rollback();
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page, items, frequency } = req.query;

    const startDate = new Date();
    let dateFilter = { userId: userId };

    if (frequency > 0) {
      const endDate = new Date(
        startDate.getTime() - `${frequency}` * 24 * 60 * 60 * 1000
      );
      dateFilter.date = { $gte: endDate, $lte: startDate };
    }

    const pages = await Expense.countDocuments(dateFilter);

    const expenses = await Expense.find(dateFilter)
      .skip((page - 1) * parseInt(items))
      .limit(parseInt(items));

    // console.log("???????????", expenses, pages);
    return res
      .status(200)
      .send({ expenses: expenses, pages: Math.round(pages / 10) + 1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { userId } = req.user;
    const id = req.params.id;

    const expenseToDelete = await Expense.findOne({_id: id, userId});
    if (!expenseToDelete) {
      return res.status(500).send({ msg: "Expense not found" });
    }

    const amount = expenseToDelete.amount;

    const filter = {_id: id, userId: userId}
    const [deleted] = await Promise.all([
        Expense.deleteOne(filter),
        User.updateOne(
          {_id: userId},
          {$inc: {totalexpense: -amount}}
        )
    ])

    return res.status(200).send({ msg: "Expense deleted" });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};

exports.editExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const id = req.params.id;
    const { amount, category, description, date } = req.body;

    const filter = { _id: id, userId: userId };
    const update = {
      $set: {
        amount: amount,
        category: category,
        description: description,
        date: date,
      },
    };

    await Expense.findOneAndUpdate( filter, update);

    return res.status(200).send({ msg: "Updated Expense!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Internal Server Error!!" });
  }
};
