const express = require('express');

const sigupController = require('../controllers/signup');

const router  = express.Router();

router.post('/signup', sigupController.signUp)

module.exports = router;