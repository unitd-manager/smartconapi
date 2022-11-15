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

app.get('/getpayrollmanagementMain', (req, res, next) => {
  db.query(`SELECT pm.*
  ,CONCAT_WS(' ', e.first_name) AS employee_name
  ,e.position AS designation
  ,e.salary
  ,e.date_of_birth AS dob
  ,e.spr_year
  ,e.citizen
  ,e.status AS employee_status
  FROM payroll_management pm
  LEFT JOIN (employee e) ON (e.employee_id = pm.employee_id)
  WHERE pm.payroll_management_id != ''
  ORDER BY e.first_name ASC
`,
    (err, result) => {
       
      if (err) {
        console.log("error: ", err);
        result(err, null);
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

app.post('/editpayrollmanagementMain', (req, res, next) => {
  db.query(`UPDATE  cpf_calculator 
            SET from_age =${db.escape(req.body.from_age)}
                ,to_age=${db.escape(req.body.to_age)}
                ,by_employer=${db.escape(req.body.by_employer)}
                ,by_employee=${db.escape(req.body.by_employee)}
                ,year=${db.escape(req.body.year)}
                ,creation_date=${db.escape(req.body.creation_date)}
                ,modification_date=${db.escape(req.body.modification_date)}
                ,created_by=${db.escape(req.body.created_by)}
                ,modified_by=${db.escape(req.body.modified_by)}
                ,flag=${db.escape(req.body.flag)}
                ,from_salary=${db.escape(req.body.from_salary)}
                ,to_salary=${db.escape(req.body.to_salary)}
                ,cap_amount_employer=${db.escape(req.body.cap_amount_employer)}
                ,cap_amount_employee=${db.escape(req.body.cap_amount_employee)}
                ,spr_year=${db.escape(req.body.spr_year)}
                ,site_id=${db.escape(req.body.site_id)}
                
             WHERE cpf_calculator_id  =  ${db.escape(req.body.cpf_calculator_id )}`,
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

app.post('/insertpayroll_management', (req, res, next) => {

  let data = {from_age: req.body.from_age,
              to_age: req.body.to_age,
              by_employer: req.body.by_employer,
              by_employee	: req.body.by_employee,
              year: req.body.year,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              flag: req.body.flag,
              from_salary: req.body.from_salary,
              to_salary: req.body.to_salary,
              cap_amount_employer: req.body.cap_amount_employer,
              cap_amount_employee: req.body.cap_amount_employee,
              spr_year: req.body.spr_year,
              site_id: req.body.site_id,

          };

  let sql = "INSERT INTO payroll_management SET ?";
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

app.delete('/deletepayroll_management', (req, res, next) => {

  let data = {cpf_calculator_id : req.body.cpf_calculator_id };
  let sql = "DELETE FROM payroll_management WHERE ?";
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