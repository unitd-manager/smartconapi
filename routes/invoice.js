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

app.get('/getMainInvoice', (req, res, next) => {
  db.query("SELECT i.* ,cont.contact_id ,c.company_id ,CONCAT_WS(' ', cont.first_name, cont.last_name) AS contact_name ,cont.position as position ,cont.company_address_flat ,cont.company_address_street ,cont.company_address_town ,cont.company_address_state ,cont.company_address_country ,c.company_name ,p.title AS project_title ,p.project_value AS project_value ,p.currency AS project_currency ,p.description AS project_description ,p.project_code as project_code ,ca.address_flat AS comp_mul_address_flat ,ca.address_street AS comp_mul_address_street ,ca.address_town AS comp_mul_address_town ,ca.address_state AS comp_mul_address_state ,ca.address_country AS comp_mul_address_country ,DATEDIFF(Now() ,i.invoice_due_date) AS age ,(IF(ISNULL(( SELECT FORMAT(SUM(invoice_amount), 0) FROM invoice WHERE project_id = i.project_id AND invoice_code < i.invoice_code AND status != LOWER('Cancelled') )), 0, ( SELECT FORMAT(SUM(invoice_amount), 0) FROM invoice WHERE project_id = i.project_id AND invoice_code < i.invoice_code AND status != LOWER('Cancelled') ))) AS prior_invoice_billed ,b.title AS branch_name FROM invoice i LEFT JOIN (project p) ON (i.project_id = p.project_id) LEFT JOIN (contact cont) ON (p.contact_id = cont.contact_id) LEFT JOIN (company c) ON (p.company_id = c.company_id) LEFT JOIN (company_address ca)ON (cont.company_address_id = ca.company_address_id) LEFT JOIN branch b ON(p.branch_id = b.branch_id) WHERE i.invoice_id != '' ORDER BY i.invoice_code DESC",
    (err, result) => {

      if (result.length == 0) {
        return res.status(400).send({
          msg: 'No result found'
        });
      } else {
        return res.status(200).send({
          data: result,
          msg: 'Success'
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