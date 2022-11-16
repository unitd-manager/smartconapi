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


app.get('/getValueList', (req, res, next) => {
  db.query(`Select v.key_text
  ,v.value
  ,v.code
  ,v.creation_date
  ,v.modification_date
  From valuelist v 
  Where v.valuelist_id  !=''`,
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

app.post('/editValueList', (req, res, next) => {
  db.query(`UPDATE valuelist 
            SET key_text=${db.escape(req.body.key_text)}
            ,value=${db.escape(req.body.value)}
            ,code=${db.escape(req.body.code)}
            WHERE valuelist_id = ${db.escape(req.body.valuelist_id)}`,
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