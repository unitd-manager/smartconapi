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
app.get('/getClients', (req, res, next) => {
  db.query(`Select c.company_name
  ,c.phone
  ,c.website
  ,c.email
  ,c.fax
  ,c.address_flat
  ,c.address_street
  ,c.address_country
  ,c.address_po_code
  ,c.retention
  From company c 
  Where c.company_id !=''`,
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



app.get('/getContactLinked', (req, res, next) => {
  db.query(`SELECT 
  c.first_name
  ,c.email
  ,c.phone
  ,c.mobile
  ,c.position
  ,c.department 
  FROM contact c WHERE c.contact_id = ''`,
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