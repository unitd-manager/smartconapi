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
app.get('/getusergroup', (req, res, next) => {
  db.query(`SELECT ug.title
  ,ug.user_group_type
  FROM user_group ug
  WHERE ug.user_group_id != ''`,
    (err, result) => {
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



app.post('/edit-usergroup', (req, res, next) => {
  db.query(`UPDATE user_group  
            SET title=${db.escape(req.body.title)}
            ,user_group_type=${db.escape(req.body.user_group_type)}
            WHERE user_group_id = ${db.escape(req.body.user_group_id)}`,
    (err, result) => {
     
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

app.post('/insertUserGroup', (req, res, next) => {

  let data = {title: req.body.title
    , user_group_type: req.body.user_group_type
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date};
  let sql = "INSERT INTO user_group SET ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Success'
          });
    }
  });
});



app.delete('/deleteUserGroup', (req, res, next) => {

  let data = {user_group_id:req.body.user_group_id };
  let sql = "DELETE FROM user_group WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Success'
          });
    }
  });
});

app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;