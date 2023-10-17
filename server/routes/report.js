const express = require('express');

const validator = require('../middlewares/authenticator')

const reportController = require('../controllers/report');

const router  = express.Router();

router.post('/download', validator, reportController.downloadReport);

router.get('/getdownloadlinks', validator , reportController.getDownloadLinks);

module.exports = router;