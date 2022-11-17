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

app.post('/insertemployee_timesheet', (req, res, next) => {

  let data = {creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              employee_hours: req.body.employee_hours,
              date: req.body.date,
              hourly_rate: req.body.hourly_rate,
              month: req.body.month,
              year: req.body.year,
              description: req.body.description,
              employee_ot_hours: req.body.employee_ot_hours,
              employee_ph_hours: req.body.employee_ph_hours,
              ot_hourly_rate: req.body.ot_hourly_rate,
              ph_hourly_rate: req.body.ph_hourly_rate,
              admin_charges: req.body.admin_charges,
              transport_charges: req.body.transport_charges,
              sign_staff_id: req.body.sign_staff_id,

               };

  let sql = "INSERT INTO employee_timesheet  SET ?";
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

app.delete('/deleteEmployee_timesheet', (req, res, next) => {

  let data = {employee_timesheet_id : req.body.employee_timesheet_id };
  let sql = "DELETE FROM employee_timesheet WHERE ?";
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


app.post('/insertproject_employee', (req, res, next) => {

  let data = {creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              active_in_project: req.body.active_in_project,
              category_type: req.body.category_type,
              
               };

  let sql = "INSERT INTO project_employee SET ?";
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

app.delete('/deleteProject_employee', (req, res, next) => {

  let data = {project_employee_id : req.body.project_employee_id };
  let sql = "DELETE FROM project_employee WHERE ?";
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