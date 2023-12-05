const Download = require('../models/download');
const S3Services = require('../services/S3services')

exports.downloadReport = async (req, res) => {
    try {
        const {userId} = req.user;
        const formData = req.files.pdfFile;

        const date = new Date()
        const filename = `Expense${userId}/${date}.txt`;

        const fileURL = await S3Services.uploadToS3(formData.data, filename);

        const download = new Download({
            URL: fileURL,
            date: date,
            userId: userId
        })
        download.save()
        return res.status(200).send({ fileURL })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}

exports.getDownloadLinks = async (req, res) => {
    try {
        const report = await Download.find({ userId: req.user.userId  })
        return res.status(200).send({report})
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error!!" })
    }
}