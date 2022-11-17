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

app.get('/WorkOrderPortal', (req, res, next) => {
  db.query(`SELECT 
  q.sub_con_work_order_id 
  ,q.work_order_due_date 
  ,q.completed_date 
  ,q.sub_con_id 
  ,q.status 
  ,q.project_location 
  ,q.project_reference 
  ,q.quote_reference 
  ,q.quote_date 
  ,q.project_location 
  ,s.company_name FROM sub_con_work_order q 
  LEFT JOIN (project p) ON (p.project_id = q.project_id) 
  LEFT JOIN (sub_con s) ON (s.sub_con_id = q.sub_con_id) WHERE p.project_id !=''`,
    (err, result) => {
       

      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });

          }
   
      }
    );
  });

  app.post('/editWorkOrderPortal', (req, res, next) => {
    db.query(`UPDATE sub_con_work_order
              SET work_order_due_date=${db.escape(req.body.work_order_due_date)}
              ,completed_date=${db.escape(req.body.completed_date)}
              ,project_location=${db.escape(req.body.project_location)}
              ,project_reference=${db.escape(req.body.project_reference)}
              ,quote_date=${db.escape(req.body.quote_date)}
              WHERE project_id = ${db.escape(req.body.project_id)}`,
      (err, result) => {
       
        if (err) {
          console.log("error: ", err);
          return;
        } else {
              return res.status(200).send({
                data: result,
                msg:'Success'
              });
        }
       }
    );
  });

app.get('/PaymentHistoryPortal', (req, res, next) => {
  db.query(`SELECT 
  sr.amount
  ,sr.creation_date AS date
  ,sr.mode_of_payment
  ,sr.sub_con_payments_id
  ,sr.sub_con_id
  ,srh.sub_con_work_order_id
  ,sc.company_name FROM sub_con_payments_history srh LEFT JOIN (sub_con_payments sr) ON (sr.sub_con_payments_id = srh.sub_con_payments_id) LEFT JOIN (sub_con sc) ON (sc.sub_con_id = sr.sub_con_id) WHERE sr.project_id != '' AND sr.status != 'Cancelled'
  ORDER BY srh.sub_con_payments_history_id`,
    (err, result) => {
       
      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });

        }
 
    }
  );
});





app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;