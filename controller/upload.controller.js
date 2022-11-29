const upload = require("../helper/uploader");
const util = require("util");
const db = require('../config/Database.js');
const uniqid = require('uniqid');
const fs = require("fs");
const path = require('path');
const baseUrl = "http://localhost:3001/file/getFile/";
const directoryPath = __basedir + "/storage/uploads/"

exports.index = (req, res) => {
    return res.render('index', { message: req.flash() });
}

exports.uploadSingle = (req, res) => {
    if (req.file) {
        console.log(req.file)

        req.flash('success', 'File Uploaded.');
    }
    return res.redirect('/');
}

exports.uploadFile = (req, res) => {

    if (req.file == undefined) {
        return res.status(400).send({message:"Please upload a file..."});
    }

    if (req.file) {
        let data = {creation_date: new Date()
            , media_type: "attachment"
            , actual_file_name: req.file.originalname
            , display_title: req.file.originalname
            , file_name: uniqid() + "_" +req.file.originalname
            , content_type: "attachment"
            , media_size: req.file.size
            , room_name: req.body.room_name
            , record_type: "attachment"
            , alt_tag_data: req.body.alt_tag_data
            , external_link: ""
            , caption: ""
            , uploaded: ""
            , record_id: req.body.record_id
            , modification_date: new Date()
            , description: req.body.description
          };
        console.log(req.file)
        let sql = "INSERT INTO media SET ?";
        let query = db.query(sql, data,(err, result) => {
            if (err) {
              console.log("error: ", err);
              return;
            } else {
                res.status(200).send({message:"Uploaded the file successfully : " + req.file.originalname});
            }
          });
    }
}

exports.getFileList = (req, res) => {

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
          res.status(500).send({
            message: "Unable to scan files!",
          });
        }
    
        let fileInfos = [];
    
        files.forEach((file) => {
          fileInfos.push({
            name: file,
            url: baseUrl + file,
          });
        });
    
        res.status(200).send(fileInfos);
      });    
}

exports.getFile = (req, res) => {
    const fileName = req.params.name;
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
}

exports.downloadFile = (req, res) => {
  let data = {record_id: req.body.record_id};
  let sql = "SELECT file_name FROM media WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    const fileName = result[0].file_name;
    const filePath = path.resolve(directoryPath + result[0].file_name);
    console.log("fileName : ",fileName);
    console.log("filePath : ",filePath);
    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      } else {
        return res.status(200).send({
          data: result[0].file_name,
          msg: result[0].file_name + ' has been downloaded successfully'
        });        
      }
    });
  });
}

exports.removeFile = (req, res) => {
    const fileName = req.params.name;
    fs.unlink(directoryPath + fileName, (err) => {
        if (err) {
          res.status(500).send({
            message: "Could not delete the file. " + err,
          });
        }
    
        res.status(200).send({
          message: "File is deleted.",
        });
      });
}

exports.uploadMultiple = (req, res) => {
    if (req.files.length) {
        console.log(req.files)

        req.flash('success', 'Files Uploaded.');
    }
    return res.redirect('/');
}

exports.uploadSingleV2 = async (req, res) => {
    const uploadFile = util.promisify(upload.single('file'));
    try {
        await uploadFile(req, res);
        console.log(req.file)
        
        req.flash('success', 'File Uploaded.');
    } catch (error) {
        console.log(error)
    }
    return res.redirect('/');
}