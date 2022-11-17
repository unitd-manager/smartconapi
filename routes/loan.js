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
  db.query(`SELECT l.employee_id
  ,l.status
  ,l.amount
  ,l.type
  ,l.month_amount
  ,l.loan_closing_date
  ,l.notes
  ,l.loan_start_date
  ,l.date
    ,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name
  FROM loan l
  LEFT JOIN (employee e) ON (e.employee_id = l.employee_id)
  WHERE l.loan_id !=''`,
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

app.post('/editTabLoan', (req, res, next) => {
    db.query(`UPDATE loan
              SET amount=${db.escape(req.body.amount)}
              ,month_amount=${db.escape(req.body.month_amount)}
              ,notes=${db.escape(req.body.notes)}
              ,date=${db.escape(req.body.date)}
              ,type=${db.escape(req.body.type)}
              WHERE loan_id = ${db.escape(req.body.loan_id)}`,
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

     app.post('/insertLoan', (req, res, next) => {

      let data = {date	:req.body.date	
      ,amount: req.body.amount
      , employee_id: req.body.employee_id
      , type: req.body.type
      , status: req.body.status
      , due_date: req.body.due_date
      , creation_date	: req.body.creation_date	
      , modification_date: req.body.modification_date
      , created_by: req.body.created_by
      , modified_by: req.body.modified_by
      , flag: req.body.flag
      , no_of_months: req.body.no_of_months
      , deduction	: req.body.deduction	
      , approved_by: req.body.approved_by
      , loan_closing_date: req.body.loan_closing_date
       , month_amount: req.body.month_amount
       , loan_start_date: req.body.loan_start_date                
       , notes: req.body.notes};
                let sql = "INSERT INTO loan SET ?";
                let query = db.query(sql, data,(err, result) => {
                  if (err) {
                    console.log("error: ", err);
                    return;
                  } else {
                        return res.status(200).send({
                          data: result,
                          msg:'New Tender has been created successfully'
                        });
                  }
                });
              });

              app.delete('/deleteTabLoan', (req, res, next) => {

                let data = {employee_id: req.body.employee_id};
                let sql = "DELETE FROM loan WHERE ?";
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

  app.get('/TabPreviousEarlierLoan', (req, res, next) => {
    db.query(`SELECT l.date
    ,l.amount
    ,l.status
    ,l.employee_id
    ,l.due_date
    ,l.loan_closing_date
    ,l.loan_start_date
    ,l.month_amount
    ,l.amount FROM loan l
        WHERE l.employee_id != ''
        AND date < l.date;`,
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