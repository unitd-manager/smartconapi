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

app.get('/getTabClaimPaymentPortal', (req, res, next) => {
  db.query(`SELECT cp.date,cp.claim_seq
            ,cp.claim_payment_id
            ,cp.amount
            ,cp.created_by
            ,cp.creation_date
            ,cp.status
            ,cp.claim_amount
            , SUM(amount) AS claim_amount,count(claim_payment_id) AS countRec 
            FROM claim_payment cp WHERE cp.project_id != ' ' AND cp.project_claim_id != '' 
            GROUP BY cp.claim_seq;`,
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
  
  app.post('/insertClaimPaymenttable', (req, res, next) => {

    let data = {project_claim_id: req.body.project_claim_id,
                claim_line_items_id: req.body.claim_line_items_id,
                date: req.body.date,
                claim_seq: req.body.claim_seq,
                amount: req.body.amount,
                project_id: req.body.project_id,
                created_by: req.body.created_by,
                creation_date: req.body.creation_date,
                modified_by: req.body.modified_by,
                modification_date: req.body.modification_date,
                claim_amount: req.body.claim_amount,
                description: req.body.description,
                status: req.body.status,
                gst: req.body.gst,
                total_amount: req.body.total_amount,
              };
    let sql = "INSERT INTO claim_payment SET ?";
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

  app.post('/insertClaimLineItems', (req, res, next) => {

    let data = {project_claim_id: req.body.project_claim_id,
                title: req.body.title,
                description: req.body.description,
                amount: req.body.amount,
                amount_other: req.body.amount_other,
                item_type: req.body.item_type,
                sort_order: req.body.sort_order,
                creation_date: req.body.creation_date,
                modification_date: req.body.modification_date,
                quantity: req.body.quantity,
                project_id: req.body.project_id,
                created_by: req.body.created_by,
                modified_by: req.body.modified_by,
                unit: req.body.unit,
                remarks: req.body.remarks,
                status: req.body.status,

              };
    let sql = "INSERT INTO claim_line_items SET ?";
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

  app.post('/insertProjectClaim', (req, res, next) => {

    let data = {claim_no: req.body.claim_no,
                project_id: req.body.project_id,
                client_id: req.body.client_id,
                project_title: req.body.project_title,
                description: req.body.description,
                po_quote_no: req.body.po_quote_no,
                ref_no: req.body.ref_no,
                claim_date: req.body.claim_date,
                status: req.body.status,
                amount: req.body.amount,
                created_by: req.body.created_by,
                creation_date: req.body.creation_date,
                modified_by: req.body.modified_by,
                modification_date: req.body.modification_date,
                variation_order_submission: req.body.variation_order_submission,
                value_of_contract_work_done: req.body.value_of_contract_work_done,
                vo_claim_work_done: req.body.vo_claim_work_done,
                claim_code: req.body.claim_code,
                less_previous_retention: req.body.less_previous_retention,
              };
    let sql = "INSERT INTO project_claim SET ?";
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