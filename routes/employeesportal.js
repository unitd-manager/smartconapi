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