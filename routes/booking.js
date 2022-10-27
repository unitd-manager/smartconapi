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
  db.query("SELECT b.booking_date,b.assign_time,b.status,b.gps_parameter,c.company_name AS c_company_name,c.email AS c_email, c.address_flat AS c_address_flat,c.address_street AS c_address_street,c.address_town AS c_address_town,c.address_state AS c_address_state,c.address_country AS c_address_country, c.address_po_code AS c_address_po_code,c.phone AS c_phone,c.fax AS c_fax,c.status AS c_status,c.website AS c_website,c.category AS c_category,CONCAT_WS(' ', e.first_name, e.last_name) AS employee_name FROM booking b LEFT JOIN employee e ON (e.employee_id = b.employee_id) LEFT JOIN (company c) ON ( c.company_id = b.customer_id )",
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
app.get('/getTabServiceLink', (req, res, next) => {
  db.query(`SELECT * FROM booking_service WHERE booking_id = '' ORDER BY booking_service_id`,
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