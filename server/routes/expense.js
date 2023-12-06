const express = require('express');

const validator = require('../middlewares/authenticator')

const ExpenseController = require('../controllers/expense');

const router  = express.Router();

router.post('/add-expense', validator, ExpenseController.addExpense);

router.get('/get-expense', validator, ExpenseController.getExpenses);

router.delete('/delete-expense/:id', validator, ExpenseController.deleteExpense);

router.put('/edit-expense/:id', validator, ExpenseController.editExpense)

module.exports = router;