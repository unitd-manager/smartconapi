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



app.get('/TabLoan', (req, res, next) => {
  db.query(`SELECT l.*
  ,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name
FROM loan l
LEFT JOIN (employee e) ON (e.employee_id = l.employee_id)
WHERE l.loan_id !=''`,
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

app.get('/TabPaymentHistory', (req, res, next) => {
    db.query(`SELECT lrh.loan_repayment_history_id
    ,DATE_FORMAT(lrh.generated_date, '%d-%m-%Y') AS payment_date
    ,CONCAT_WS('/', pm.payroll_month, pm.payroll_year) AS payroll_month_year
    ,lrh.loan_repayment_amount_per_month
    ,lrh.remarks
FROM loan_repayment_history lrh
LEFT JOIN loan l ON (lrh.loan_id = l.loan_id)
LEFT JOIN payroll_management pm ON (lrh.payroll_management_id = pm.payroll_management_id)
WHERE lrh.loan_id != ''
ORDER BY lrh.generated_date DESC`,
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

  app.get('/TabPreviousEarlierLoan', (req, res, next) => {
    db.query(`SELECT * FROM loan l
    WHERE l.employee_id != ''
    AND date < l.date`,
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