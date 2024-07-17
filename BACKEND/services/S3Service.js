// services/S3Service.js

const AWS = require('aws-sdk');
const { v1: uuidv1 } = require('uuid');

// Initialize S3 client
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}); 

// Function to upload data to S3
async function uploadToS3(data, filename) {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filename,
            Body: data
        };

        const uploadResult = await s3.upload(params).promise();
        console.log("File uploaded to S3:", uploadResult.Location);
        return uploadResult.Location;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw new Error("Failed to upload file to S3");
    }
}

module.exports = uploadToS3;
