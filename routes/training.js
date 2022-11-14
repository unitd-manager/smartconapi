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
app.get('/getTraining', (req, res, next) => {
  db.query(`SELECT t.title
  ,t.date
  ,t.to_date
  ,t.trainer
  ,t.description
  ,t.training_company_name
  ,t.training_company_address
  ,t.training_company_email
  ,t.training_company_phone
  FROM training t
WHERE t.training_id != ''`,
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




app.post('/edit-Training', (req, res, next) => {
  db.query(`UPDATE training  
            SET title=${db.escape(req.body.title)}
            ,date=${db.escape(req.body.title)}
            ,to_date=${db.escape(req.body.to_date)}
            ,trainer=${db.escape(req.body.trainer)}
            ,description=${db.escape(req.body.description)}
            ,training_company_name=${db.escape(req.body.training_company_name)}
            ,training_company_address=${db.escape(req.body.training_company_address)}
            ,training_company_email=${db.escape(req.body.training_company_email)}
            ,training_company_phone =${db.escape(req.body.training_company_phone)}
            WHERE training_id = ${db.escape(req.body.training_id)}`,
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


app.get('/getTabEmployeeLinked', (req, res, next) => {
  db.query(` SELECT ts.training_staff_id 
  ,ts.from_date
  ,ts.to_date
  ,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name
  ,ji.designation
  FROM training_staff ts
  LEFT JOIN (employee e) ON (ts.staff_id = e.employee_id)
   LEFT JOIN (job_information ji) ON (e.employee_id = ji.employee_id)
   WHERE training_id != ''
  ORDER BY training_staff_id DESC`,
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





app.post('/edit-TabEmployeeLinked', (req, res, next) => {
  db.query(`UPDATE training_staff 
            SET training_staff_id=${db.escape(req.body.training_staff_id)}
            ,from_date=${db.escape(req.body.from_date)}
            ,to_date=${db.escape(req.body.to_date)}
            WHERE training_id = ${db.escape(req.body.training_id)}`,
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