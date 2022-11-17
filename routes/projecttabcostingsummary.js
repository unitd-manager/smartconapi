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

app.get('/getTabCostingSummary', (req, res, next) => {
    db.query(`SELECT 
    c.no_of_worker_useds
    ,c.no_of_days_worked
    ,c.labour_rates_per_day
    ,c.po_price
    ,c.po_price_with_gst
    ,c.profit_percentage
    ,c.profit
    ,c.total_material_price
    ,c.transport_charges
    ,c.total_labour_charges
    ,c.salesman_commission
    ,c.finance_charges
    ,c.office_overheads
    ,c.other_charges
    ,c.total_cost of FROM costing_summary c WHERE c.project_id != '' ORDER BY c.costing_summary_id DESC`,
      (err, result) =>{
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