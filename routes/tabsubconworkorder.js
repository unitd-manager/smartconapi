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


app.get('/getTabClaimPaymentPortal', (req, res, next) => {
  db.query(`SELECT cp.date,cp.claim_seq
            ,cp.claim_payment_id
            ,cp.amount
            ,cp.created_by
            ,cp.creation_date
            ,cp.status
            ,cp.claim_amount
            , SUM(amount) AS claim_amount,count(claim_payment_id) AS countRec 
            FROM claim_payment cp WHERE cp.project_id != ' ' AND cp.project_claim_id != '' 
            GROUP BY cp.claim_seq;`,
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
     



app.get('/WorkOrderPortal', (req, res, next) => {
  db.query(`SELECT 
  q.sub_con_work_order_id 
  ,q.work_order_due_date 
  ,q.completed_date 
  ,q.sub_con_id 
  ,q.status 
  ,q.project_location 
  ,q.project_reference 
  ,q.quote_reference 
  ,q.quote_date 
  ,q.project_location 
  ,s.company_name FROM sub_con_work_order q 
  LEFT JOIN (project p) ON (p.project_id = q.project_id) 
  LEFT JOIN (sub_con s) ON (s.sub_con_id = q.sub_con_id) WHERE p.project_id !=''`,
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

  app.post('/editWorkOrderPortal', (req, res, next) => {
    db.query(`UPDATE sub_con_work_order
              SET work_order_due_date=${db.escape(req.body.work_order_due_date)}
              ,completed_date=${db.escape(req.body.completed_date)}
              ,project_location=${db.escape(req.body.project_location)}
              ,project_reference=${db.escape(req.body.project_reference)}
              ,quote_date=${db.escape(req.body.quote_date)}
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

app.get('/PaymentHistoryPortal', (req, res, next) => {
  db.query(`SELECT 
  sr.amount
  ,sr.creation_date AS date
  ,sr.mode_of_payment
  ,sr.status 
  ,sr.sub_con_payments_id
  ,sr.sub_con_id
  ,srh.sub_con_work_order_id
  ,sc.company_name FROM sub_con_payments_history srh LEFT JOIN (sub_con_payments sr) ON (sr.sub_con_payments_id = srh.sub_con_payments_id) LEFT JOIN (sub_con sc) ON (sc.sub_con_id = sr.sub_con_id) WHERE sr.project_id != '' AND sr.status != 'Cancelled'
  ORDER BY srh.sub_con_payments_history_id`,
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

app.get('/TabClaimPortal', (req, res, next) => {
  db.query(`SELECT 
  pc.claim_date
  ,pc.project_title
  ,pc.ref_no
  ,pc.variation_order_submission
  ,pc.vo_claim_work_done
  ,pc.status
  ,pc.description
  ,pc.po_quote_no
  ,pc.value_of_contract_work_done
  ,pc.less_previous_retention
  ,pc.amount
  ,c.company_name FROM project_claim pc 
  LEFT JOIN (project p) ON (p.project_id = pc.project_id) LEFT JOIN (company c) ON (c.company_id = pc.client_id) WHERE pc.project_id != '';`,
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

app.post('/editTabClaimPortal', (req, res, next) => {
  db.query(`UPDATE project_claim
            SET claim_date=${db.escape(req.body.claim_date)}
            ,project_title=${db.escape(req.body.project_title)}
            ,ref_no=${db.escape(req.body.ref_no)}
            ,variation_order_submission=${db.escape(req.body.variation_order_submission)}
            ,vo_claim_work_done=${db.escape(req.body.vo_claim_work_done)}
            ,description=${db.escape(req.body.description)}
            ,po_quote_no=${db.escape(req.body.po_quote_no)}
            ,value_of_contract_work_done=${db.escape(req.body.value_of_contract_work_done)}
            ,less_previous_retention=${db.escape(req.body.less_previous_retention)}
            ,amount=${db.escape(req.body.amount)}
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

app.get('/TabClaimPortalLineItem', (req, res, next) => {
  db.query(`SELECT 
  ct.title
  ,ct.description
  ,ct.amount
  ,ct.status FROM claim_line_items ct LEFT JOIN project_claim pc ON (pc.project_claim_id = ct.project_claim_id) WHERE pc.project_id != '' AND ct.project_claim_id != '' ORDER BY ct.claim_line_items_id ASC`,
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

app.post('/editTabClaimPortalLineItem', (req, res, next) => {
  db.query(`UPDATE claim_line_items
            SET title=${db.escape(req.body.title)}
            ,description=${db.escape(req.body.description)}
            ,amount=${db.escape(req.body.amount)}
                        WHERE project_id = ${db.escape(req.body.project_id)} AND project_claim_id = ${db.escape(req.body.project_claim_id)}`,
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