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

app.get('/hello', (req, res, next) => {
  db.query("SELECT p.*, CONCAT_WS(' ', cont.first_name, cont.last_name) AS contact_name ,c.company_name ,c.company_size ,c.source ,c.industry ,o.opportunity_code ,( SELECT GROUP_CONCAT( CONCAT_WS(' ', stf.first_name, stf.last_name) ORDER BY CONCAT_WS(' ', stf.first_name, stf.last_name) SEPARATOR ', ' ) FROM staff stf ,project_staff ts WHERE ts.project_id = p.project_id AND stf.staff_id = ts.staff_id ) AS staff_name ,ser.title as service_title ,CONCAT_WS(' ', s.first_name, s.last_name) AS project_manager_name ,(p.project_value - (IF(ISNULL(( SELECT SUM(invoice_amount) FROM invoice i LEFT JOIN (`order` o) ON (i.order_id = o.order_id) WHERE o.project_id = p.project_id AND LOWER(i.status) != 'cancelled' ) ),0, ( SELECT SUM(invoice_amount) FROM invoice i LEFT JOIN (`order` o) ON (i.order_id = o.order_id) WHERE o.project_id = p.project_id AND LOWER(i.status) != 'cancelled' ) ))) AS still_to_bill FROM project p LEFT JOIN (contact cont)  ON (p.contact_id         = cont.contact_id) LEFT JOIN (company c)     ON (p.company_id         = c.company_id) LEFT JOIN (service ser)   ON (p.service_id         = ser.service_id) LEFT JOIN (staff   s)     ON (p.project_manager_id = s.staff_id) LEFT JOIN (opportunity o) ON (p.opportunity_id     = o.opportunity_id) WHERE ( LOWER(p.status) = 'wip' OR LOWER(p.status) = 'billable' OR LOWER(p.status) = 'billed' ) AND ( LOWER(p.status) = 'wip' OR LOWER(p.status) = 'billable' OR LOWER(p.status) = 'billed' ) ORDER BY p.project_code DESC",
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

app.get('/TabLeave', (req, res, next) => {
  db.query(`SELECT * FROM leave`,
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

app.get('/getCostingSummary', (req, res, next) => {
  db.query("SELECT c.* FROM `opportunity_costing_summary` c WHERE c.opportunity_id =  ORDER BY c.opportunity_costing_summary_id DESC",
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
app.get('/getTabEmployee', (req, res, next) => {
  db.query(" SELECT a.employee_id ,a.first_name AS title ,'' ,a.status FROM employee a LEFT JOIN (opportunity_employee pe) ON (pe.employee_id = a.employee_id) WHERE pe.opportunity_id != '' ORDER BY title",
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

app.post('/insertOpportunityEmployee', (req, res, next) => {

  let data = {
    opportunity_id:req.body.opportunity_id
     ,employee_id: req.body.employee_id
    , category_type: req.body.category_type
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , active_in_project: req.body.active_in_project
    
    };
  let sql = "INSERT INTO opportunity_employee SET ?";
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

app.delete('/deleteOpportunityEmployee', (req, res, next) => {

  let data = {opportunity_id: req.body.opportunity_id};
  let sql = "DELETE FROM opportunity_employee WHERE ?";
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