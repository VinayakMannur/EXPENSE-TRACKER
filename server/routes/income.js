const express = require('express');

const validator = require('../middlewares/authenticator')

const IncomeController = require('../controllers/income');

const router  = express.Router();

router.post('/add-income', validator,IncomeController.addIncome);

router.post('/get-income', validator,IncomeController.getIncome);

// router.post('/delete-expense', validator,expenseController.deleteExpense);

// router.post('/edit-expense', validator,expenseController.editExpense)

module.exports = router;