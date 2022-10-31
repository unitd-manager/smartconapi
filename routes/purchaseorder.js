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



app.get('/TabPurchaseOrder', (req, res, next) => {
  db.query(`SELECT DISTINCT 
  po.title
  ,po.status
  ,po.company_id_supplier
  ,po.priority
  ,po.notes
  ,po.purchase_order_date
  ,po.follow_up_date
  ,po.delivery_terms
  ,po.payment_terms
  ,po.payment_status
  ,po.supplier_inv_code
  ,po.po_code
  ,s.company_name
  FROM purchase_order po 
  LEFT JOIN (supplier s) ON (po.company_id_supplier = s.supplier_id) WHERE po.project_id != '' ORDER BY po.purchase_order_id ASC;`,
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

app.post('/editTabPurchaseOrder', (req, res, next) => {
  db.query(`UPDATE purchase_order
            SET title=${db.escape(req.body.title)}
            ,company_id_supplier=${db.escape(req.body.company_id_supplier)}
            ,notes=${db.escape(req.body.notes)}
            ,purchase_order_date=${db.escape(req.body.purchase_order_date)}
            ,follow_up_date=${db.escape(req.body.follow_up_date)}
            ,delivery_terms=${db.escape(req.body.delivery_terms)}
            ,payment_terms=${db.escape(req.body.payment_terms)}
            ,supplier_inv_code=${db.escape(req.body.supplier_inv_code)}
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

app.get('/TabPurchaseOrderLineItem', (req, res, next) => {
  db.query(`SELECT
  po.description
  ,po.unit
  ,po.amount
  ,po.selling_price
  ,po.cost_price
  ,po.status
  ,po.modification_date
  ,po.creation_date
  ,po.modified_by FROM po_product po WHERE po.purchase_order_id != '' ORDER BY po.item_title ASC`,
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

app.post('/editTabPurchaseOrderLineItem', (req, res, next) => {
  db.query(`UPDATE po_product
            SET description=${db.escape(req.body.description)}
            ,unit=${db.escape(req.body.unit)}
            ,amount=${db.escape(req.body.amount)}
            ,selling_price=${db.escape(req.body.selling_price)}
            ,cost_price=${db.escape(req.body.cost_price)}
            ,modification_date=${db.escape(req.body.modification_date)}
            ,creation_date=${db.escape(req.body.creation_date)}
            ,modified_by=${db.escape(req.body.modified_by)}
            WHERE purchase_order_id = ${db.escape(req.body.purchase_order_id)}`,
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

app.get('/TabMaterialUsedPortal', (req, res, next) => {
  db.query(`SELECT pm.title
  ,pm.description
  ,pm.unit
  ,pm.quantity
  ,project_materials_id
  ,project_id
  ,p.product_type FROM project_materials pm 
  LEFT JOIN (product p) ON (p.product_id = pm.product_id) WHERE pm.project_id != '' ORDER BY pm.project_materials_id ASC`,
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

app.post('/editTabMaterialUsedPortal', (req, res, next) => {
  db.query(`UPDATE project_materials
            SET title=${db.escape(req.body.title)}
            ,description=${db.escape(req.body.description)}
            ,unit=${db.escape(req.body.unit)}
            ,quantity=${db.escape(req.body.quantity)}
            WHERE project_id=${db.escape(req.body.project_id)}`,
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

app.get('/TabMaterialTransferred', (req, res, next) => {
  db.query(`SELECT 
  st.quantity
  ,st.to_project_id
  ,p.title
  ,p.price FROM stock_transfer st 
  LEFT JOIN (product p) ON (p.product_id = st.product_id) WHERE st.to_project_id != '' ORDER BY st.creation_date ASC`,
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
  db.query(`UPDATE project_materials
            SET quantity=${db.escape(req.body.quantity)}
            ,title=${db.escape(req.body.title)}
            ,price=${db.escape(req.body.price)}
            WHERE project_id=${db.escape(req.body.project_id)}`,
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

app.get('/TabDeliveryOrder', (req, res, next) => {
  db.query(`SELECT do.date FROM delivery_order do WHERE project_id != ''`,
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

  app.post('/editTabDeliveryOrder', (req, res, next) => {
    db.query(`UPDATE delivery_order
              SET date=${db.escape(req.body.date)}
              WHERE project_id=${db.escape(req.body.project_id)}`,
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