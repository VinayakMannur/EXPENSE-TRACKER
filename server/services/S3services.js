const AWS = require('aws-sdk');
require('dotenv').config()

const  uploadToS3 = (data, filename) => {

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET
    })

    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, rejecct) => {
        s3bucket.upload(params, (err, s3responce) => {
            if (err) {
                // console.log(err);
                rejecct(err)
            } else {
                // console.log(s3responce);
                resolve(s3responce.Location)
            }
        })
    })
}

module.exports ={
    uploadToS3
}