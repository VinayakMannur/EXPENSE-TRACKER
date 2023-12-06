const express = require('express');

const LoginController = require('../controllers/login');

const router  = express.Router();

router.post('/login', LoginController.logIn)

module.exports = router;