"use strict";
const AWS = require("aws-sdk");
const path = require("path");
const multer = require("multer");
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
});
console.log("Create Aws S3 instance");


//? 단일 이미지 처리
exports.awsS3Upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        key: (req, file, callback) => {

            const extension = path.extname(file.originalname);
            extension.split(".")[1];

            callback(null, Date.now().toString() + extension);
        },
        acl: process.env.S3_ACL,
    }),
    fileFilter : (req, file, callback) => {

        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

        if( extName ) {
            return callback(null, true); 
        } else {
            req.fileTypeError = true;
            callback("Error : Images Only!");
        }
    }
}).single("image");


//? 한개 이상의 이미지 처리
exports.awsS3ArrayUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        key: (req, files, callback) => {
            const extension = path.extname(files.originalname);
            extension.split(".")[1];
            callback(null, Date.now().toString() + extension);
        },
        acl: process.env.S3_ACL,
    }),
    fileFilter : (req, file, callback) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

        if( extName ) {
            return callback(null, true); 
        } else {
            req.fileTypeError = true;
            callback("Error : Images Only!");
        }
    }
}).array("images", 5);


//? 이미지 삭제
exports.awsS3Delete = ( fullUrlKey ) => {
    if( fullUrlKey ){
        const step1 = fullUrlKey.split("com")[1];
        const key = step1.split("/")[1];
        s3.deleteObject({
            Bucket : process.env.S3_BUCKET,
            Key : key
        }, (err, data) => {
            if(err) console.log(`Image delete false : ${ err }`);
            else console.log("Image delete success");
        });
    } else {
        console.log("이미지 id는 있지만, null 값으로 존재");
    }
}
