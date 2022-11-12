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
app.get('/getusergroup', (req, res, next) => {
  db.query(`SELECT ug.title
  ,ug.user_group_type
  FROM user_group ug
WHERE ug.user_group_id != ''`,
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


app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;