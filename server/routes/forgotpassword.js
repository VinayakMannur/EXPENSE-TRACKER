const express = require('express');

const forgotPasswordController = require('../controllers/forgotpassword');

const router  = express.Router();

router.post('/password/forgotpassword', forgotPasswordController.forgotPassword)

router.post('/password/updatepassword', forgotPasswordController.updatePassword)

module.exports = router;