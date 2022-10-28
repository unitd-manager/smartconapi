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

app.get('/getInvoiceTab', (req, res, next) => {
  db.query(`SELECT i.quote_code
           ,i.po_number
           ,i.project_location
           ,i.project_reference
           ,i.discount
           ,i.code
           ,i.so_ref_no
           ,i.site_code
           ,i.attention
           ,i.reference
           ,i.invoice_date
           ,invoice_terms
           ,i.title
           ,(SELECT GROUP_CONCAT(r.receipt_code ORDER BY r.receipt_code SEPARATOR ', ') 
           FROM receipt r, invoice_receipt_history invrecpt 
           WHERE r.receipt_id = invrecpt.receipt_id AND i.invoice_id = invrecpt.invoice_id) AS receipt_codes_history 
           FROM invoice i WHERE i.order_id != '' ORDER BY i.invoice_id DESC`,
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

app.post('/editInvoiceTab', (req, res, next) => {
  db.query(`UPDATE invoice 
            SET quote_code =${db.escape(req.body.quote_code)}
            ,po_number=${db.escape(req.body.po_number)}
            ,project_location=${db.escape(req.body.project_location)}
            ,project_reference=${db.escape(req.body.project_reference)}
            ,discount=${db.escape(req.body.discount)}
            ,code=${db.escape(req.body.code)}
            ,so_ref_no=${db.escape(req.body.so_ref_no)}
            ,attention=${db.escape(req.body.attention)}
            ,site_code=${db.escape(req.body.site_code)}
            ,reference=${db.escape(req.body.reference)}
            ,invoice_date=${db.escape(req.body.invoice_date)}
            ,invoice_terms=${db.escape(req.body.invoice_terms)}
           
             WHERE order_id =  ${db.escape(req.body.order_id)}`,
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

app.get('/getReceiptTab', (req, res, next) => {
  db.query(`SELECT DISTINCT r.receipt_id
            ,r.receipt_code
            ,r.receipt_status
            ,r.date
            ,r.amount
            ,r.mode_of_payment
            ,r.remarks
            ,r.creation_date
            ,r.created_by
            ,r.modification_date
            ,r.modified_by FROM receipt r 
            LEFT JOIN (invoice_receipt_history irh) ON (r.receipt_id = irh.receipt_id) 
            WHERE r.order_id != '' ORDER BY r.receipt_id DESC;`,
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

app.post('/editReceiptTab', (req, res, next) => {
  db.query(`UPDATE receipt 
             r.receipt_id=${db.escape(req.body.r.receipt_id)}
            ,r.receipt_code=${db.escape(req.body.r.receipt_code)}
            ,r.receipt_status=${db.escape(req.body.r.receipt_status)}
            ,r.date=${db.escape(req.body.r.date)}
            ,r.amount=${db.escape(req.body.r.amount)}
            ,r.mode_of_payment=${db.escape(req.body.r.mode_of_payment)}
            ,r.remarks=${db.escape(req.body.r.remarks)}
            ,r.creation_date=${db.escape(req.body.r.creation_date)}
            ,r.created_by=${db.escape(req.body.r.created_by)}
            ,r.modification_date=${db.escape(req.body.r.modification_date)}
            ,r.modified_by=${db.escape(req.body.r.modified_by)}
            WHERE = r.order_id != '' ${db.escape(req.body.r.order_id)}`,
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


app.get('/getTabEmployeePortal', (req, res, next) => {
  db.query(`SELECT a.employee_id
            ,a.first_name AS title,''
            ,a.status,IF(pe.active_in_project = '1' 
            ,CONCAT_WS('', '<input type=checkbox checked class=project_employee_in name=active_in_project value=',a.employee_id,'>') 
            ,CONCAT_WS('', '<input type=checkbox class=project_employee_in name=active_in_project value=',a.employee_id,'>')) 
            AS project_Select 
            FROM employee a 
            LEFT JOIN (project_employee pe) ON (pe.employee_id = a.employee_id) 
            WHERE pe.project_id != '' 
            ORDER BY title`,
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

app.get('/getTabEmployeeTimeSheet', (req, res, next) => {
  db.query(`SELECT DATE_FORMAT(et.date, '%Y-%m') AS dateMonth
            ,DATE_FORMAT(et.date, '%M') AS Month
            ,DATE_FORMAT(et.date, '%m') AS month_req
            ,DATE_FORMAT(et.date, '%Y') AS year_req
            ,DATE_FORMAT(et.date, '%Y-%m') AS year_Months
            ,SUM(et.employee_hours) AS totalHours
            ,SUM(et.employee_ot_hours) AS totalOTHours
            ,SUM(et.employee_ph_hours) AS totalPHHours
            ,et.project_id FROM employee_timesheet et 
            WHERE et.project_id != '' 
            GROUP BY DATE_FORMAT(et.date, '%Y-%m') 
            ORDER BY et.date DESC`,
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