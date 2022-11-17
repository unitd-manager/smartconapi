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

app.get('/getBooking', (req, res, next) => {
  db.query(`SELECT b.booking_date
  ,b.assign_time
  ,b.status
  ,b.gps_parameter
  ,b.created_by
  ,b.modified_by
  ,c.company_name AS c_company_name
  ,c.email AS c_email,
   c.address_flat AS c_address_flat,
   c.address_street AS c_address_street
   ,c.address_town AS c_address_town
   ,c.address_state AS c_address_state
   ,c.address_country AS c_address_country
   , c.address_po_code AS c_address_po_code
   ,c.phone AS c_phone
   ,c.fax AS c_fax
   ,c.status AS c_status
   ,c.website AS c_website
   ,c.category AS c_category,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name 
   FROM booking b LEFT JOIN employee e ON (e.employee_id = b.employee_id) LEFT JOIN (company c) ON ( c.company_id = b.customer_id )`,
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


app.post('/edit-Booking', (req, res, next) => {
  db.query(`UPDATE booking b,company c 
            SET b.booking_date=${db.escape(req.body.booking_date)}
            ,b.assign_time=${db.escape(req.body.assign_time)}
            ,b.status=${db.escape(req.body.status)}
            ,b.gps_parameter=${db.escape(req.body.gps_parameter)}
            ,c.company_name=${db.escape(req.body.company_name)}
            WHERE customer_id = ${db.escape(req.body.customer_id)}`,
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



app.post('/insertBooking', (req, res, next) => {

  let data = {customer_id: req.body.customer_id
    , employee_id: req.body.employee_id
    , assign_time: req.body.assign_time
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , created_by: req.body.created_by
    , modified_by: req.body.modified_by
    , gps_parameter: req.body.gps_parameter
    , status: req.body.status
    , booking_date: req.body.booking_date
    , latitude: req.body.latitude
    , longitude: req.body.longitude};
  let sql = "INSERT INTO booking SET ?";
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



app.delete('/deleteBooking', (req, res, next) => {

  let data = {booking_id  : req.body.booking_id  };
  let sql = "DELETE FROM booking WHERE ?";
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

app.get('/getTabServiceLink', (req, res, next) => {
  db.query(`SELECT * FROM booking_service WHERE booking_id = '' ORDER BY booking_service_id`,
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



app.post('/insertbooking_service', (req, res, next) => {

  let data = {booking_id: req.body.booking_id,
              service: req.body.service,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              modified_by: req.body.modified_by,
              created_by: req.body.created_by};
  let sql = "INSERT INTO booking_service SET ?";
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

app.delete('/deleteBooking_service', (req, res, next) => {

  let data = {booking_service_id : req.body.booking_service_id };
  let sql = "DELETE FROM booking_service WHERE ?";
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