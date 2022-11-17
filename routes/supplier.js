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
  db.query(`SELECT s.company_name
  ,s.email
  ,s.fax
  ,s.mobile
  ,s.status
  ,s.gst_no
  ,s.contact_person
  ,s.address_flat
  ,s.address_street
  ,s.address_state
  ,s.address_country
  ,s.address_po_code
  ,s.payment_details
  ,s.terms
  ,gc.name AS country_name 
  FROM supplier s LEFT JOIN (geo_country gc) ON (s.address_country = gc.country_code) WHERE s.supplier_id != ''`,
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


app.post('/editSupplier', (req, res, next) => {
  db.query(`UPDATE supplier 
            SET company_name=${db.escape(req.body.company_name)}
            ,email=${db.escape(req.body.email)}
            ,fax=${db.escape(req.body.fax)}
            ,mobile=${db.escape(req.body.mobile)}
            ,status=${db.escape(req.body.status)}
            ,gst_no=${db.escape(req.body.gst_no)}
            ,contact_person=${db.escape(req.body.contact_person)}
            ,address_flat=${db.escape(req.body.address_flat)}
            ,address_street=${db.escape(req.body.address_street)}
            ,address_state=${db.escape(req.body.address_state)}
            ,address_country=${db.escape(req.body.address_country)}
            ,address_po_code=${db.escape(req.body.address_po_code)}
            ,payment_details=${db.escape(req.body.payment_details)}
            ,terms=${db.escape(req.body.terms)}
            WHERE supplier_id =  ${db.escape(req.body.supplier_id)}`,
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


app.post('/insertSupplier', (req, res, next) => {

  let data = {company_name: req.body.company_name,
              email: req.body.email,
              address_street: req.body.address_street,
              address_town: req.body.address_town,
              address_state: req.body.address_state,
              address_country: req.body.address_country,
              address_po_code: req.body.address_po_code,
              phone: req.body.phone,
              fax: req.body.fax,
              notes: req.body.notes,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
              mobile: req.body.mobile,
              flag: req.body.email,
              address_flat: req.body.address_street,
              status: req.body.status,
              website: req.body.address_state,
              category: req.body.category,
              comment_by: req.body.comment_by,
              company_size: req.body.company_size,
              industry: req.body.industry,
              source: req.body.source,
              group_name: req.body.group_name,
              supplier_type: req.body.supplier_type,
              created_by: req.body.created_by,
              modified_by: req.body.modified_by,
              chi_company_name: req.body.chi_company_name,
              chi_company_address: req.body.chi_company_address,
              company_address_id: req.body.company_address_id,
              contact_person: req.body.contact_person,
              billing_address_flat: req.body.billing_address_flat,
              billing_address_street: req.body.billing_address_street,
              billing_address_country: req.body.billing_address_country,
              billing_address_po_code: req.body.billing_address_po_code,
              gst_no: req.body.gst_no,
              terms: req.body.terms,
              payment_details: req.body.payment_details};
  let sql = "INSERT INTO supplier SET ?";
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




app.delete('/deleteSupplier', (req, res, next) => {

  let data = {supplier_id : req.body.supplier_id  };
  let sql = "DELETE FROM supplier WHERE ?";
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


app.post('/insertGeo_country', (req, res, next) => {

  let data = {country_code: req.body.country_code,
              name: req.body.name,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              published: req.body.published,
              flag: req.body.flag,
              chi_name: req.body.chi_name};
  let sql = "INSERT INTO geo_country SET ?";
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

app.delete('/deleteGeo_country', (req, res, next) => {

  let data = {geo_country_id  : req.body.geo_country_id   };
  let sql = "DELETE FROM geo_country WHERE ?";
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


app.get('/getTabPurchaseOrderLinked', (req, res, next) => {
  db.query(`SELECT p.purchase_order_id 
            FROM purchase_order p 
            WHERE p.company_id_supplier != '' AND (p.payment_status != 'Cancelled' OR p.payment_status IS NULL)`,
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



app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;