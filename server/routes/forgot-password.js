const express = require('express');

const ForgotPasswordController = require('../controllers/forgot-password')

const router  = express.Router();

router.post('/password/forgotpassword', ForgotPasswordController.forgotPassword)

router.get('/password/forgotpassword/:uniqueId', ForgotPasswordController.resetLink)

router.put('/password/updatepassword', ForgotPasswordController.updatePassword)

module.exports = router;