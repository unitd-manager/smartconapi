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

  app.post('/insertdelivery_order', (req, res, next) => {

    let data = {project_id: req.body.project_id,
                company_id: req.body.company_id,
                date: req.body.date,
                created_by: req.body.created_by,
                creation_date: req.body.creation_date,
                modified_by: req.body.modified_by,
                modification_date: req.body.modification_date,
                purchase_order_id: req.body.purchase_order_id,
                 };
  
    let sql = "INSERT INTO delivery_order SET ?";
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

  app.post('/insertPurchaseOrder', (req, res, next) => {

    let data = {po_code:req.body.mr_code
      ,company_id_supplier: req.body.company_id_supplier
     , contact_id_supplier: req.body.contact_id_supplier
     , delivery_terms: req.body.delivery_terms
     , status: req.body.status
     , project_id: req.body.project_id
     , flag: req.body.flag
     , creation_date: req.body.creation_date
     , modification_date: req.body.modification_date
     , created_by: req.body.created_by
     , modified_by: req.body.modified_by
     , supplier_reference_no: req.body.supplier_reference_no
     , our_reference_no	: req.body.our_reference_no	
     , shipping_method: req.body.shipping_method
     , payment_terms: req.body.payment_terms
     , delivery_date: req.body.delivery_date
     , po_date: req.body.mr_date
     , shipping_address_flat: req.body.shipping_address_flat
     , shipping_address_street: req.body.shipping_address_street
     , shipping_address_country: req.body.shipping_address_country
     , shipping_address_po_code: req.body.shipping_address_po_code
     , expense_id: req.body.expense_id
     , staff_id: req.body.staff_id
     , purchase_order_date: req.body.materials_request_date
     , payment_status: req.body.payment_status
     , title: req.body.title
     , priority: req.body.priority
     , follow_up_date: req.body.follow_up_date
     , notes: req.body.notes
     , supplier_inv_code: req.body.supplier_inv_code
     , gst: req.body.gst
     , gst_percentage: req.body.gst_percentage
     , delivery_to: req.body.delivery_to
     , contact: req.body.contact
     , mobile: req.body.mobile
     , payment: req.body.payment
     , project: req.body.project
      
   };
    let sql = "INSERT INTO materials_request_line_items SET ?";
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