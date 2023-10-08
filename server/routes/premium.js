const express = require('express');

const validator = require('../middlewares/authenticator');

const premiumController = require('../controllers/premium');

const router  = express.Router();

router.get('/buypremium', validator, premiumController.buyPremium);

router.post('/updatetransactionstatus', validator, premiumController.updateStatus);

module.exports = router;