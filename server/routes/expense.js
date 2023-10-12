const express = require('express');

const validator = require('../middlewares/authenticator')

const expenseController = require('../controllers/expense');

const router  = express.Router();

router.post('/add-expense', validator,expenseController.addExpense);

router.post('/get-expense', validator,expenseController.getExpenses);

router.post('/delete-expense', validator,expenseController.deleteExpense);

router.post('/edit-expense', validator,expenseController.editExpense)

router.get('/download', validator, expenseController.downloadReport);

router.get('/getdownloadlinks', validator , expenseController.getDownloadLinks);

module.exports = router;