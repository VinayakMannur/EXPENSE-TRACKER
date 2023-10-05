const express = require('express');

const expenseController = require('../controllers/expense');

const router  = express.Router();

router.post('/add-expense/:userId', expenseController.addExpense);

router.post('/get-expense/:userId', expenseController.getExpenses);

router.post('/delete-expense', expenseController.deleteExpense);

router.post('/edit-expense/:userId', expenseController.editExpense)

module.exports = router;