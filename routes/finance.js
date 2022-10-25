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

app.get('/getFinances', (req, res, next) => {
  db.query("SELECT o.project_id,o.project_type,o.creation_date,o.order_status,o.invoice_terms,o.notes,o.shipping_first_name,o.shipping_address1,o.shipping_address2,o.shipping_address_country,o.delivery_date,o.delivery_terms,o.cust_address1,o.cust_address2,o.cust_address_country,o.cust_address_po_code,gc2.name AS shipping_country_name,c.company_name AS company_name,c.website AS company_website,c.fax AS company_fax ,c.phone AS company_phone,c.address_flat AS company_address_flat ,c.address_street AS company_address_street,c.address_town AS company_address_town,c.address_state AS company_address_state ,gc3.name AS company_country_name,(SELECT (SUM(oi.unit_price * oi.qty) + o.shipping_charge) FROM order_item oi WHERE oi.order_id = o.order_id) AS order_amount,q.quote_code,p.project_code FROM `order` o LEFT JOIN geo_country gc2 ON (o.shipping_address_country_code = gc2.country_code) LEFT JOIN company c ON (o.company_id = c.company_id) LEFT JOIN geo_country gc3 ON (c.address_country = gc3.country_code) LEFT JOIN quote q ON o.quote_id = q.quote_id LEFT JOIN project p ON o.project_id = p.project_id WHERE o.order_id !='' ",
    (err, result) => {

      if (result.length == 0) {
        return res.status(400).send({
          msg: 'No result found'
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Success'
        });

      }

    }
  );
});

app.get('/getTabOrderItemPanel', (req, res, next) => {
  db.query(`SELECT order_item_id, unit_price,qty,discount_percentage,description,remarks FROM order_item WHERE order_id != '' ORDER BY order_item_id ASC;`,
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
app.get('/getTabInvoicePortalDisplay', (req, res, next) => {
  db.query(`SELECT i.quote_code
  ,i.po_number,i.project_location,i.project_reference,i.discount,i.code,i.so_ref_no,i.site_code,i.attention,i.reference,i.invoice_date,invoice_terms,i.title,(SELECT GROUP_CONCAT(r.receipt_code ORDER BY r.receipt_code SEPARATOR ', ') FROM receipt r, invoice_receipt_history invrecpt WHERE r.receipt_id = invrecpt.receipt_id AND i.invoice_id = invrecpt.invoice_id) AS receipt_codes_history FROM invoice i WHERE i.order_id != '' ORDER BY i.invoice_id DESC`,
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



app.get('/getTabReceiptPortalDisplay', (req, res, next) => {
  db.query(`SELECT DISTINCT r.receipt_id,r.receipt_id,r.receipt_code,r.receipt_status,r.date,r.amount,r.mode_of_payment,r.remarks,r.creation_date,r.created_by,r.modification_date,r.modified_by 
            FROM receipt r 
            LEFT JOIN (invoice_receipt_history irh) ON (r.receipt_id = irh.receipt_id) WHERE r.order_id != '' 
            ORDER BY r.receipt_id DESC`,
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

app.get('/getTabCreditNotePortalDisplay', (req, res, next) => {
  db.query(`
  SELECT DISTINCT cn.credit_note_id,cn.credit_note_code,cn.amount,cn.gst_amount,cn.date FROM credit_note cn WHERE cn.order_id != '' ORDER BY cn.credit_note_id DESC`,
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


app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;