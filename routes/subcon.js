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

app.get('/getSubcon', (req, res, next) => {
  db.query(`SELECT s.company_name
  ,s.email,
  s.fax
  ,s.mobile
  ,s.status
  ,s.address_flat
  ,s.address_street
  ,s.address_state
  ,s.address_country
  ,gc.name AS country_name 
  FROM sub_con s LEFT JOIN (geo_country gc) ON (s.address_country = gc.country_code) WHERE s.sub_con_id != ''`,
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


app.post('/edit-Subcon', (req, res, next) => {
  db.query(`UPDATE sub_con 
            SET company_name=${db.escape(req.body.company_name)}
            ,email=${db.escape(req.body.email)}
            ,fax=${db.escape(req.body.fax)}
            ,mobile=${db.escape(req.body.mobile)}
            ,status=${db.escape(req.body.status)}
            ,address_flat=${db.escape(req.body.address_flat)}
            ,address_street=${db.escape(req.body.address_street)}
            ,address_state=${db.escape(req.body.address_state)}
            ,address_country=${db.escape(req.body.address_country)}
            WHERE sub_con_id =  ${db.escape(req.body.sub_con_id)}`,
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

app.get('/getTabWorkOrder', (req, res, next) => {
  db.query(`SELECT p.sub_con_work_order_id FROM sub_con_work_order p 
            WHERE p.sub_con_id != '' AND (p.status != 'Cancelled' OR p.status IS NULL)`,
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
app.post('/insertsub_con_work_order', (req, res, next) => {

  let data = {sub_con_worker_code: req.body.sub_con_worker_code,
              work_order_date: req.body.work_order_date,
              work_order_due_date: req.body.work_order_due_date,
              completed_date: req.body.completed_date,
              project_id: req.body.project_id,
              sub_con_id: req.body.sub_con_id,
              work_order: req.body.work_order,
              status: req.body.status,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              project_location: req.body.project_location,
              project_reference: req.body.project_reference,
              condition: req.body.condition,
              quote_date: req.body.quote_date,
              quote_reference: req.body.quote_reference,};
  let sql = "INSERT INTO sub_con_work_order  SET ?";
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

app.post('/insertsub_con_payments_history', (req, res, next) => {

  let data = {sub_con_work_order_id: req.body.sub_con_work_order_id,
              sub_con_payments_id: req.body.sub_con_payments_id,
              published: req.body.published,
              flag: req.body.flag,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              amount: req.body.amount,
              work_order_date: req.body.work_order_date,
              invoice_paid_status: req.body.invoice_paid_status,
              title: req.body.title,
              receipt_type: req.body.receipt_type,
              related_sub_con_work_order_id: req.body.related_sub_con_work_order_id};
  let sql = "INSERT INTO sub_con_payments_history SET ?";
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

app.post('/insertsub_con_payments', (req, res, next) => {

  let data = {project_id: req.body.project_id,
              sub_con_id: req.body.sub_con_id,
              work_order: req.body.work_order,
              amount: req.body.amount,
              status: req.body.status,
              remarks: req.body.remarks,
              mode_of_payment: req.body.mode_of_payment,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by};
  let sql = "INSERT INTO sub_con_payments SET ?";
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


app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;