const express = require('express');

const validator = require('../middlewares/authenticator')

const ReportController = require('../controllers/report');

const router  = express.Router();

router.post('/download', validator, ReportController.downloadReport);

router.get('/getdownloadlinks', validator , ReportController.getDownloadLinks);

module.exports = router;