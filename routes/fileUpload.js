const express = require('express');
const router = express.Router();
const upload = require('../helper/uploader');
const uploadController = require('../controller/upload.controller');

router.get('/',uploadController.index);
router.post('/uploadFile',upload.single('file'),uploadController.uploadFile);
router.get('/getFileList',uploadController.getFileList);
// router.get('/getFile/:name',uploadController.getFile);
router.post('/downloadFile',uploadController.downloadFile);
router.delete('/getFile/:name',uploadController.removeFile);
/* router.post('/upload-single',upload.single('file'),uploadController.uploadSingle);
router.post('/upload-multiple',upload.array('files', 5), uploadController.uploadMultiple);
router.post('/upload-single-v2',uploadController.uploadSingleV2); */

module.exports = router;
