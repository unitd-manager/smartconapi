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
app.get('/getAccounts', (req, res, next) => {
  db.query(`Select e.date 
  ,e.group
  ,e.sub_group 
  ,e.amount 
  ,e.gst_amount 
  ,e.service_charge 
  ,e.total_amount 
  ,e.description 
  ,e.invoice_code 
  ,e.invoice_date 
  ,e.payment_ref_no 
  ,e.job_id 
  ,e.remarks 
  FROM expense e 
  WHERE expense_id !=''`,
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

app.post('/editAccounts', (req, res, next) => {
  db.query(`UPDATE expense
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.amount)}
            ,gst_amount=${db.escape(req.body.gst_amount)}
            ,service_charge=${db.escape(req.body.service_charge)}
            ,description=${db.escape(req.body.description)}
            ,invoice_code=${db.escape(req.body.invoice_code)}
            ,invoice_date=${db.escape(req.body.invoice_date)}
            ,payment_ref_no=${db.escape(req.body.payment_ref_no)}
            ,job_id=${db.escape(req.body.job_id)}
            ,remarks=${db.escape(req.body.remarks)}
            WHERE expense_id = ${db.escape(req.body.expense_id)}`,
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
app.post('/insertexpense', (req, res, next) => {

  let data = {group	:req.body.group	
   , sub_group	: req.body.sub_group	
   , date: req.body.date
   , amount: req.body.amount
   , gst_amount: req.body.gst_amount
   , service_charge	: req.body.service_charge
   , description	: req.body.description
   , created_by: req.body.created_by
   , creation_date: req.body.creation_date
   , modified_by: req.body.modified_by
   , modification_date		: req.body.modification_date		
   , site_id	: req.body.site_id	
   , quote_id	: req.body.quote_id	
   , source: req.body.source
   , gst: req.body.gst
   , gst_percentage: req.body.gst_percentage
   , invoice_date: req.body.invoice_date
   , invoice_code: req.body.invoice_code
   , payment_status	: req.body.payment_status
   , received_date	: req.body.received_date
   , bank: req.body.bank
   , mode_of_payment: req.body.mode_of_payment
   , po_code: req.body.po_code
   , po_date: req.body.po_date
   , cheque_no		: req.body.cheque_no		
   , issued_date	: req.body.issued_date	
   , payment_cleared_date: req.body.payment_cleared_date
   , company_id: req.body.company_id
   , supplier_id: req.body.supplier_id
   , supplier_name: req.body.supplier_name
   , supplier_gst	: req.body.supplier_gst
   , customer_name	: req.body.customer_name
   , customer_gst: req.body.customer_gst
   , new_company: req.body.new_company
   , from_purchase_order: req.body.from_purchase_order
   , payment_ref_no: req.body.payment_ref_no
   , payment_date	: req.body.payment_date	
   , total_amount	: req.body.total_amount	
   , job_id: req.body.job_id
   , remarks: req.body.remarks
   
    
 };
  let sql = "INSERT INTO expense SET ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Success'
          });
    }
  });
});

app.delete('/deleteExpense', (req, res, next) => {

  let data = {group: req.body.group};
  let sql = "DELETE FROM expense WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Success'
          });
    }
  });
});




app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;