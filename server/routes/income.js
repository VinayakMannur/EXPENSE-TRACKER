const express = require('express');

const validator = require('../middlewares/authenticator')

const IncomeController = require('../controllers/income');

const router  = express.Router();

router.post('/add-income', validator, IncomeController.addIncome);

router.get('/get-income', validator, IncomeController.getIncome);

module.exports = router;