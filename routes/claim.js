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

  
app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;