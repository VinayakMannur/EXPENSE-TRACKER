const express = require('express');

const validator = require('../middlewares/authenticator');

const PremiumController = require('../controllers/premium');

const router  = express.Router();

router.get('/buypremium', validator, PremiumController.buyPremium);

router.post('/updatetransactionstatus', validator, PremiumController.updateStatus);

router.get('/leaderboard', validator, PremiumController.leaderBoard);

module.exports = router;