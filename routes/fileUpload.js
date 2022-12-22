const express = require('express');
const router = express.Router();
const upload = require('../helper/uploader');
const uploadController = require('../controller/upload.controller');
const maxFiles = 5;

router.get('/',uploadController.index);
router.post('/uploadFile',upload.single('file'),uploadController.uploadFile);
router.get('/getFileList',uploadController.getFileList);
// router.get('/getFile/:name',uploadController.getFile);
router.post('/downloadFile',uploadController.downloadFile);
router.delete('/deleteFile',uploadController.removeFile);
//router.post('/upload-single',upload.single('file'),uploadController.uploadSingle);
router.post('/uploadFiles',upload.array('files', maxFiles), uploadController.uploadMultiple);
//router.post('/upload-single-v2',uploadController.uploadSingleV2);

module.exports = router;
