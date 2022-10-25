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

app.get('/getSupplier', (req, res, next) => {
  db.query("SELECT s.company_name,s.email,s.fax,s.mobile,s.status,s.gst_no,s.contact_person,s.address_flat,s.address_street,s.address_state,s.address_country,s.address_po_code,s.payment_details,s.terms,gc.name AS country_name FROM supplier s LEFT JOIN (geo_country gc) ON (s.address_country = gc.country_code) WHERE s.supplier_id != ''",
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

app.get('/getTabPurchaseOrderLinked', (req, res, next) => {
  db.query(`SELECT p.purchase_order_id 
            FROM purchase_order p 
            WHERE p.company_id_supplier != '' AND (p.payment_status != 'Cancelled' OR p.payment_status IS NULL)`,
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