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



app.get('/TabMaterialRequest', (req, res, next) => {
  db.query(`SELECT 
  mr.mr_date
  ,mr.project_name
  ,mr.site_reference
  ,mr.request_by
  ,mr.request_date
  ,mr.approved_by
  ,mr.approved_date
  ,mr.shipping_method
  ,mr.delivery_terms FROM materials_request mr WHERE mr.project_id != '' ORDER BY mr.materials_request_id DESC;`,
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

app.post('/editTabMaterialRequest', (req, res, next) => {
  db.query(`UPDATE materials_request
            SET mr_date=${db.escape(req.body.mr_date)}
            ,project_name=${db.escape(req.body.project_name)}
            ,site_reference=${db.escape(req.body.site_reference)}
            ,request_by=${db.escape(req.body.request_by)}
            ,request_date=${db.escape(req.body.request_date)}
            ,approved_by=${db.escape(req.body.approved_by)}
            ,shipping_method=${db.escape(req.body.shipping_method)}
            ,delivery_terms=${db.escape(req.body.delivery_terms)}
            WHERE project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/TabMaterialRequestlineitems', (req, res, next) => {
  db.query(`SELECT 
  mrli.quantity
  ,mrli.unit
  ,mrli.amount
  ,mrli.item_title
  ,mrli.supplier_id
  ,mrli.description FROM materials_request_line_items mrli 
  LEFT JOIN supplier s ON (s.supplier_id = mrli.supplier_id) WHERE mrli.materials_request_id != '' ORDER BY mrli.item_title ASC;`,
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

app.post('/editTabMaterialRequestlineitems', (req, res, next) => {
  db.query(`UPDATE materials_request_line_items
            SET quantity=${db.escape(req.body.quantity)}
            ,unit=${db.escape(req.body.unit)}
            ,amount=${db.escape(req.body.amount)}
            ,item_title=${db.escape(req.body.item_title)}
            ,supplier_id=${db.escape(req.body.supplier_id)}
            ,description=${db.escape(req.body.description)}
            WHERE materials_request_id = ${db.escape(req.body.materials_request_id)}`,
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