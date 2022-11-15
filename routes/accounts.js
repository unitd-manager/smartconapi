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
app.get('/getAccounts', (req, res, next) => {
  db.query(`Select e.date 
  ,e.group
  ,e.sub_group 
  ,e.amount 
  ,e.gst_amount 
  ,e.service_charge 
  ,e.total_amount 
  ,e.description 
  ,e.invoice_code 
  ,e.invoice_date 
  ,e.payment_ref_no 
  ,e.job_id 
  ,e.remarks 
  FROM expense e 
  WHERE expense_id !=''`,
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

app.post('/editAccounts', (req, res, next) => {
  db.query(`UPDATE expense
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.amount)}
            ,gst_amount=${db.escape(req.body.gst_amount)}
            ,service_charge=${db.escape(req.body.service_charge)}
            ,description=${db.escape(req.body.description)}
            ,invoice_code=${db.escape(req.body.invoice_code)}
            ,invoice_date=${db.escape(req.body.invoice_date)}
            ,payment_ref_no=${db.escape(req.body.payment_ref_no)}
            ,job_id=${db.escape(req.body.job_id)}
            ,remarks=${db.escape(req.body.remarks)}
            WHERE expense_id = ${db.escape(req.body.expense_id)}`,
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