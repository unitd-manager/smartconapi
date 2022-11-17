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

app.get('/getcpfcalculatorMain', (req, res, next) => {
  db.query(`SELECT cpf.from_age
            ,cpf.to_age
            ,cpf.by_employer
            ,cpf.by_employee
            ,cpf.year
            ,cpf.from_salary
            ,cpf.to_salary
            ,cpf.cap_amount_employer
            ,cpf.cap_amount_employee
            ,cpf.spr_year
            ,(by_employer + by_employee) AS Total
            ,(cap_amount_employer + cap_amount_employee) AS total_cap_amount
            FROM cpf_calculator cpf
            WHERE cpf.cpf_calculator_id != ''`,
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

app.post('/editcpfcalculatorMain', (req, res, next) => {
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

app.post('/insertcpf_calculator', (req, res, next) => {

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

  let sql = "INSERT INTO cpf_calculator SET ?";
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

app.delete('/deletecpf_calculator', (req, res, next) => {

  let data = {cpf_calculator_id : req.body.cpf_calculator_id };
  let sql = "DELETE FROM cpf_calculator WHERE ?";
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