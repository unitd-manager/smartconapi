const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/Database.js');
const userMiddleware = require('../middleware/UserModel.js');
var md5 = require('md5');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const mime = require('mime-types')
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
app.use(cors());

app.use(fileUpload({
    createParentPath: true
}));

app.get('/getLeave', (req, res, next) => {
    db.query(`SELECT l.status
    ,l.leave_type
    ,l.no_of_days
    ,l.reason
    ,l.from_date
    ,l.to_date
    ,l.employee_id
    ,l.date
    ,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name
    ,j.designation
    ,e.citizen
    FROM empleave l
    LEFT JOIN (employee e) ON (l.employee_id = e.employee_id)
    LEFT JOIN (job_information j) ON (j.employee_id = l.employee_id)
    WHERE l.leave_id !=''`,
      (err, result) => {
         
        if (err) {
          console.log("error: ", err);
          return;
        } else {
              return res.status(200).send({
                data: result,
                msg:'Tender has been removed successfully'
              });
        
        
  
          }
   
      }
    );
  });

  app.post('/editLeave', (req, res, next) => {
    db.query(`UPDATE empleave
              SET reason=${db.escape(req.body.reason)}
              ,leave_type=${db.escape(req.body.leave_type)}
              ,status=${db.escape(req.body.status)}
              ,date=${db.escape(req.body.date)}
              ,from_date=${db.escape(req.body.from_date)}
              ,to_date=${db.escape(req.body.to_date)}
              ,no_of_days=${db.escape(req.body.no_of_days)}
              ,employee_id=${db.escape(req.body.employee_id)}
              WHERE leave_id = ${db.escape(req.body.leave_id)}`,
              (err, result) => {
       
                if (err) {
                  console.log("error: ", err);
                  return;
                } else {
                      return res.status(200).send({
                        data: result,
                        msg:'Tender has been removed successfully'
                      });
                
                  }
                });
              });
 app.post('/insertLeave', (req, res, next) => {

 let data = {date	:req.body.date	, employee_id: req.body.employee_id
  , leave_type: req.body.leave_type
  , from_date: req.body.from_date
  , to_date: req.body.to_date
  , reason	: req.body.reason
  , creation_date	: req.body.creation_date
  , modification_date: req.body.modification_date
  , created_by: req.body.created_by
  , modified_by: req.body.modified_by
  , no_of_days: req.body.no_of_days
  , status	: req.body.status	
  , no_of_days_next_month	: req.body.no_of_days_next_month	
  , went_overseas: req.body.went_overseas};
                let sql = "INSERT INTO empleave SET ?";
                let query = db.query(sql, data,(err, result) => {
                  if (err) {
                    console.log("error: ", err);
                    return;
                  } else {
                        return res.status(200).send({
                          data: result,
                          msg:'Tender has been removed successfully'
                        });
                  
                  }
                });
              });
              
     app.delete('/deleteLeave', (req, res, next) => {

                let data = {employee_id: req.body.employee_id};
                let sql = "DELETE FROM empleave WHERE ?";
                let query = db.query(sql, data,(err, result) => {
                  if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                  } else {
                        return res.status(200).send({
                          data: result,
                          msg:'Tender has been removed successfully'
                        });
                  }
                });
              });
             


  app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('This is the secret content. Only logged in users can see that!');
  });
  
  module.exports = app;