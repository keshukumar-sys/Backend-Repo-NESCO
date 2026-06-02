const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");
require("dotenv").config();

// AWS configuration
AWS.config.update({
  accessKeyId: process.env.IM_AWS_ACCESS_KEY,
  secretAccessKey: process.env.IM_AWS_SECRET_KEY,
  region: process.env.AWS_REGION, // e.g. ap-south-1
  signatureVersion: "v4",
});

// Create S3 instance
const s3 = new AWS.S3();

/**
 * Upload file to S3
 * @param {Object} file - multer file object
 * @param {String} folder - folder name in S3 bucket
 * @returns {String} uploaded file URL
 */
const uploadToS3 = async (file, folder = "uploads") => {
  if (!file) return null;

  const key = `${folder}/${uuid()}-${file.originalname}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME || "nescodocuments",
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: "public-read", // enable if bucket is public
  };

  const data = await s3.upload(uploadParams).promise();

  return data.Location; // Public S3 URL
};

module.exports = uploadToS3;
