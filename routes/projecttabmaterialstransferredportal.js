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


app.get('/TabMaterialTransferred', (req, res, next) => {
  db.query(`SELECT 
  st.quantity
  ,st.to_project_id
  ,p.title
  ,p.price FROM stock_transfer st 
  LEFT JOIN (product p) ON (p.product_id = st.product_id) WHERE st.to_project_id = ${db.escape(req.body.project_id)} ORDER BY st.creation_date ASC`,
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

app.post('/editTabMaterialTransferred', (req, res, next) => {
  db.query(`UPDATE stock_transfer
            SET quantity=${db.escape(req.body.quantity)}
            ,title=${db.escape(req.body.title)}
            ,price=${db.escape(req.body.price)}
            WHERE stock_transfer_id=${db.escape(req.body.stock_transfer_id)}`,
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

app.post('/insertstock_transfer', (req, res, next) => {

  let data = {from_project_id: req.body.from_project_id,
              to_project_id: req.body.to_project_id,
              product_id: req.body.product_id,
              quantity: req.body.quantity,
              creation_date: req.body.creation_date,
              modification_date: req.body.modification_date,
               };

  let sql = "INSERT INTO stock_transfer  SET ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
       return res.status(400).send({
          msg: 'No result found'
        });
    } else {
          return res.status(200).send({
            data: result,
            msg:'New Tender has been created successfully'
          });
    }
  });
});

app.delete('/deletestock_transfer', (req, res, next) => {

  let data = {stock_transfer_id : req.body.stock_transfer_id };
  let sql = "DELETE FROM stock_transfer WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
       return res.status(400).send({
          msg: 'No result found'
        });
    } else {
          return res.status(200).send({
            data: result,
            msg:'Success'
          });
    }
  });
});
module.exports = app;
