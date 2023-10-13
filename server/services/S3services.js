const AWS = require('aws-sdk');

const  uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expenseitracker'
    const IAM_USER_KEY = 'AKIAX67DMHS3XN6Q7Q3N'
    const IAM_USER_SECRET = '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'

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    var params = {
        Bucket: BUCKET_NAME,
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