const express = require('express');

const validator = require('../middlewares/authenticator')

const reportController = require('../controllers/report');

const router  = express.Router();

router.get('/download', validator, reportController.downloadReport);

router.get('/getdownloadlinks', validator , reportController.getDownloadLinks);

module.exports = router;