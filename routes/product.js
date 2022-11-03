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

app.get('/getProducts', (req, res, next) => {
  db.query(`SELECT DISTINCT p.product_id
  ,p.category_id
  ,p.sub_category_id
  ,p.title
  ,p.description,
  p.qty_in_stock
  ,p.price
  ,p.published
  ,p.creation_date
  ,p.modification_date
  ,p.description_short
  ,p.general_quotation
  ,p.unit
  ,p.product_group_id
  ,p.item_code
  ,p.modified_by
  ,p.created_by
  ,p.part_number
  ,p.price_from_supplier
  ,p.latest
  ,p.section_id
  ,p.hsn
  ,p.gst
  ,p.mrp
  ,p.tag_no
  ,p.product_type
  ,p.bar_code
  ,p.product_code
  ,p.discount_type
  ,p.discount_percentage
  ,p.discount_amount
  ,p.discount_from_date
  ,p.discount_to_date
  ,s.title AS section_title
  ,c.title AS category_title
  ,sc.title AS sub_category_title,co.company_name,co.supplier_id,(SELECT GROUP_CONCAT(co.company_name ORDER BY co.company_name SEPARATOR ', ') 
  FROM supplier co, product_company pc 
  WHERE co.supplier_id = pc.company_id AND pc.product_id = p.product_id) AS company_records
  FROM product p LEFT JOIN (category c) ON (p.category_id = c.category_id) 
  LEFT JOIN (section s) ON (p.section_id = s.section_id) 
  LEFT JOIN (sub_category sc) ON (p.sub_category_id  = sc.sub_category_id)
  LEFT JOIN (product_company pc) ON (pc.product_id = p.product_id) 
  LEFT JOIN (supplier co) ON (co.supplier_id = pc.company_id)`,
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


app.post('/edit-Product', (req, res, next) => {
  db.query(`UPDATE product 
            SET title=${db.escape(req.body.title)}
            ,category_id=${db.escape(req.body.category_id)}
            ,product_type=${db.escape(req.body.product_type)}
            ,price=${db.escape(req.body.price)}
            ,unit=${db.escape(req.body.unit)}
            ,description_short=${db.escape(req.body.description_short)}
            ,description=${db.escape(req.body.description)}
            WHERE product_id =  ${db.escape(req.body.product_id)}`,
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



app.post('/insertProduct_Company', (req, res, next) => {

  let data = {
              product_id: req.body.product_id,
              company_id: req.body.company_id,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date};
  let sql = "INSERT INTO product_company SET ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'New Tender has been created successfully'
          });
    }
  });
});

app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;