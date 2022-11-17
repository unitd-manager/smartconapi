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

app.get('/getMainInvoice', (req, res, next) => {
  db.query(`SELECT i.invoice_code
  ,i.invoice_date
  ,i.invoice_amount
  ,i.invoice_due_date
  ,i.title
  ,c.company_name
  ,i.status
  ,i.invoice_type 
  ,cont.contact_id 
  ,c.company_id 
  ,CONCAT_WS(' ', cont.first_name, cont.last_name) AS contact_name 
  ,cont.position as position 
  ,cont.company_address_flat 
  ,cont.company_address_street 
  ,cont.company_address_town 
  ,cont.company_address_state 
  ,cont.company_address_country 
  ,c.company_name 
  ,p.title AS project_title 
  ,p.project_value AS project_value 
  ,p.currency AS project_currency 
  ,p.description AS project_description 
  ,p.project_code as project_code 
  ,ca.address_flat AS comp_mul_address_flat 
  ,ca.address_street AS comp_mul_address_street 
  ,ca.address_town AS comp_mul_address_town 
  ,ca.address_state AS comp_mul_address_state 
  ,ca.address_country AS comp_mul_address_country 
  ,DATEDIFF(Now() ,i.invoice_due_date) AS age 
  ,(IF(ISNULL(( SELECT FORMAT(SUM(invoice_amount), 0) FROM invoice WHERE project_id = i.project_id AND invoice_code < i.invoice_code AND status != LOWER('Cancelled') )), 0, ( SELECT FORMAT(SUM(invoice_amount), 0) FROM invoice WHERE project_id = i.project_id AND invoice_code < i.invoice_code AND status != LOWER('Cancelled') ))) AS prior_invoice_billed ,b.title AS branch_name FROM invoice i LEFT JOIN (project p) ON (i.project_id = p.project_id) LEFT JOIN (contact cont) ON (p.contact_id = cont.contact_id) LEFT JOIN (company c) ON (p.company_id = c.company_id) LEFT JOIN (company_address ca)ON (cont.company_address_id = ca.company_address_id) LEFT JOIN branch b ON(p.branch_id = b.branch_id) WHERE i.invoice_id != '' ORDER BY i.invoice_code DESC`,
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


app.post('/insertInvoice', (req, res, next) => {

  let data = {
    invoice_code: req.body.invoice_code
    , invoice_amount: req.body.invoice_amount
    , invoice_date: req.body.invoice_date
    , mode_of_payment: req.body.mode_of_payment
    , status: req.body.status
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , flag: req.body.flag
    , created_by: req.body.created_by
    , invoice_type: req.body.invoice_type
    , invoice_due_date: req.body.invoice_due_date
    , invoice_terms: req.body.invoice_terms
    , notes: req.body.notes
    , cst: req.body.cst
    , vat: req.body.vat
    , cst_value: req.body.cst_value
    , vat_value: req.body.vat_value
    , frieght: req.body.frieght
    , p_f: req.body.p_f
    , discount: req.body.discount
    , invoice_code_vat: req.body.invoice_code_vat
    , invoice_used: req.body.invoice_used
    , invoice_code_vat_quote: req.body.invoice_code_vat_quote
    , site_id: req.body.site_id
    , manual_invoice_seq: req.body.manual_invoice_seq
    , apply_general_vat: req.body.apply_general_vat
    , selling_company: req.body.selling_company
    , project_id: req.body.project_id
    , invoice_paid_date: req.body.invoice_paid_date
    , modified_by: req.body.modified_by
    , invoice_sent_out: req.body.invoice_sent_out
    , gst_percentage: req.body.gst_percentage
    , title: req.body.title
    , rate_text: req.body.rate_text
    , qty_text: req.body.qty_text
    , start_date: req.body.start_date
    , end_date: req.body.end_date
    , reference_no: req.body.reference_no
    , CBF_Ref_No: req.body.CBF_Ref_No
    , invoice_code_user: req.body.invoice_code_user
    , invoice_sent_out_date: req.body.invoice_sent_out_date
    , payment_terms: req.body.payment_terms
    , po_number: req.body.po_number
    , project_location: req.body.project_location
    , project_reference: req.body.project_reference
    , quote_code: req.body.quote_code
    , invoice_manual_code: req.body.invoice_manual_code
    , code: req.body.code
    , site_code: req.body.site_code
    , attention: req.body.attention
    , reference: req.body.reference
 };
  let sql = "INSERT INTO invoice SET ?";
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

app.delete('/deleteInvoice', (req, res, next) => {

  let data = {invoice_code: req.body.invoice_code};
  let sql = "DELETE FROM invoice WHERE ?";
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

app.post('/insertBranch', (req, res, next) => {

  let data = {
    title: req.body.title
    , currency: req.body.currency
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
 };
  let sql = "INSERT INTO branch SET ?";
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

app.delete('/deleteBranch', (req, res, next) => {

  let data = {title: req.body.title};
  let sql = "DELETE FROM branch WHERE ?";
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

app.post('/insertCompanyAddress', (req, res, next) => {

  let data = {
    address_street: req.body.address_street
    , address_town: req.body.address_town
    , address_state: req.body.address_state
    , address_country: req.body.address_country
    , address_po_code: req.body.address_po_code
    , phone: req.body.phone
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , address_flat: req.body.address_flat
    , company_id: req.body.company_id
 };
  let sql = "INSERT INTO company_address SET ?";
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

app.delete('/deleteCompanyAddress', (req, res, next) => {

  let data = {company_id: req.body.company_id};
  let sql = "DELETE FROM company_address WHERE ?";
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