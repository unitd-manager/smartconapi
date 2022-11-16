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

app.get('/TabDeliveryOrder', (req, res, next) => {
    db.query(`SELECT do.date FROM delivery_order do WHERE project_id != ''`,
        (err, result) => {
           
          if (result.length == 0) {
            return res.status(400).send({
              msg: 'No result found'
            });
          } else {
                return res.status(200).send({
                  data: result,
                  msg:'Success'
                });
    
            }
     
        }
      );
    });
  
    app.post('/editTabDeliveryOrder', (req, res, next) => {
      db.query(`UPDATE delivery_order
                SET date=${db.escape(req.body.date)}
                WHERE project_id=${db.escape(req.body.project_id)}`,
        (err, result) => {
         
          if (result.length == 0) {
            return res.status(400).send({
              msg: 'No result found'
            });
          } else {
                return res.status(200).send({
                  data: result,
                  msg:'Success'
                });
          }
         }
      );
    });
  
    app.post('/insertdelivery_order', (req, res, next) => {
  
      let data = {project_id: req.body.project_id,
                  company_id: req.body.company_id,
                  date: req.body.date,
                  created_by: req.body.created_by,
                  creation_date: req.body.creation_date,
                  modified_by: req.body.modified_by,
                  modification_date: req.body.modification_date,
                  purchase_order_id: req.body.purchase_order_id,
                   };
    
      let sql = "INSERT INTO delivery_order SET ?";
      let query = db.query(sql, data,(err, result) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        } else {
              return res.status(200).send({
                data: result,
                msg:'New Tender has been created successfully'
              });
        }
      });
    });
  
    app.delete('/deletedelivery_order', (req, res, next) => {
  
      let data = {delivery_order_id : req.body.delivery_order_id};
      let sql = "DELETE FROM delivery_order WHERE ?";
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