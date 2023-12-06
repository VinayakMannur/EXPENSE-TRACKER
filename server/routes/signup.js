const express = require('express');

const SigupController = require('../controllers/signup');

const router  = express.Router();

router.post('/signup', SigupController.signUp)

module.exports = router;