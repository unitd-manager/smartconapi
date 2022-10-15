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

app.get('/getFinances', (req, res, next) => {
  db.query("SELECT o.*,gc2.name AS shipping_country_name,c.company_name AS company_name,c.website AS company_website,c.fax AS company_fax ,c.phone AS company_phone,c.address_flat AS company_address_flat ,c.address_street AS company_address_street,c.address_town AS company_address_town,c.address_state AS company_address_state ,gc3.name AS company_country_name,(SELECT (SUM(oi.unit_price * oi.qty) + o.shipping_charge) FROM order_item oi WHERE oi.order_id = o.order_id) AS order_amount,q.quote_code,p.project_code FROM `order` o LEFT JOIN geo_country gc2 ON (o.shipping_address_country_code = gc2.country_code) LEFT JOIN company c ON (o.company_id = c.company_id) LEFT JOIN geo_country gc3 ON (c.address_country = gc3.country_code) LEFT JOIN quote q ON o.quote_id = q.quote_id LEFT JOIN project p ON o.project_id = p.project_id WHERE o.order_id !='' ",
    (err, result) => {

      if (result.length == 0) {
        return res.status(400).send({
          msg: 'No result found'
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Success'
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