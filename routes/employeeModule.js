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

app.get('/getEmployee', (req, res, next) => {
  db.query(`SELECT DISTINCT a.employee_id AS employee_id_duplicate
  ,a.emp_code
  ,a.first_name
  ,a.salutation
  ,a.gender
  ,a.status
  ,a.date_of_birth
  ,a.passport
  ,a.date_of_expiry
  ,a.marital_status
  ,a.nationality
  ,a.race
  ,a.religion
  ,a.project_designation
  ,a.team
  ,gc.name AS country_name
  ,s.email AS login_email
  ,s.pass_word AS login_pass_word
  ,s.user_group_id AS staff_user_group_id
  ,s.published AS staff_published
FROM employee a
LEFT JOIN geo_country gc ON (a.address_country = gc.country_code)
LEFT JOIN job_information j ON (a.employee_id = j.employee_id)
LEFT JOIN staff s ON (a.employee_id = s.employee_id)
WHERE a.employee_id != ''
ORDER BY a.first_name ASC`,
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
app.get('/TabJobInformationHistory', (req, res, next) => {
  db.query(`SELECT ts.training_staff_id
  ,t.title
  ,DATE_FORMAT(ts.from_date, '%d-%m-%Y') AS training_from_date
  ,DATE_FORMAT(ts.to_date, '%d-%m-%Y') AS training_to_date
FROM training_staff ts
LEFT JOIN training t ON (ts.training_id = t.training_id)
WHERE ts.staff_id != ''
ORDER BY ts.to_date DESC`,
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
app.get('/getTabTrainingLinked', (req, res, next) => {
  db.query(`  SELECT j.job_information_id
  ,j.basic_pay
  ,DATE_FORMAT(j.act_join_date, '%d-%m-%Y') AS start_date
  ,DATE_FORMAT(j.termination_date, '%d-%m-%Y') AS end_date
FROM job_information j
WHERE j.employee_id != ''
ORDER BY j.job_information_id DESC`,
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