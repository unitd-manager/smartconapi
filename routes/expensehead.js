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
app.get('/getExpenseHead', (req, res, next) => {
  db.query(`select title
  From expense_sub_group
  Where expense_sub_group_id  !=''`,
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


app.post('/editExpenseHead', (req, res, next) => {
  db.query(`UPDATE expense_sub_group 
            SET title=${db.escape(req.body.title)}
            WHERE expense_sub_group_id = ${db.escape(req.body.expense_sub_group_id)}`,
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
app.post('/insertExpGroup', (req, res, next) => {

  let data = {expense_group_id	:req.body.expense_group_id	
   , title	: req.body.title	
   , created_by: req.body.created_by
   , creation_date: req.body.creation_date
   , modified_by: req.body.modified_by
   , modification_date	: req.body.modification_date
   , site_id	: req.body.site_id
   
    
 };
  let sql = "INSERT INTO expense_sub_group SET ?";
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

app.delete('/deleteExpGroup', (req, res, next) => {

  let data = {expense_group_id: req.body.expense_group_id};
  let sql = "DELETE FROM expense_sub_group WHERE ?";
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



app.get('/getExpenseSubHeadLinked', (req, res, next) => {
  db.query(`select title
  From expense_group
  Where expense_group_id  !=''`,
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

app.post('/insertExp', (req, res, next) => {

  let data = {
     title	: req.body.title	
   , created_by: req.body.created_by
   , creation_date: req.body.creation_date
   , modified_by: req.body.modified_by
   , modification_date	: req.body.modification_date
   , site_id	: req.body.site_id
   
    
 };
  let sql = "INSERT INTO expense_group SET ?";
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

app.delete('/deleteExp', (req, res, next) => {

  let data = {site_id: req.body.site_id};
  let sql = "DELETE FROM expense_group WHERE ?";
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