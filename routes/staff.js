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

app.get('/getStaff', (req, res, next) => {
    db.query(`SELECT (
        SELECT GROUP_CONCAT(stfGrp.title ORDER BY stfGrp.title SEPARATOR ', ')
        FROM staff_group stfGrp
            ,staff_group_history stfGrpHist
        WHERE stfGrpHist.staff_id = a.staff_id
          AND stfGrp.staff_group_id = stfGrpHist.staff_group_id
    ) AS staff_group_names,
       a.first_name
       ,a.email
       ,a.password
       ,a.status
       ,a.user_group_id
       ,a.team
       ,a.staff_type
       ,a.staff_rate
       ,a.position
       ,a.published
      ,gc.name AS country_title
      ,b.title AS user_group_title
      ,CONCAT_WS(' ', a.first_name, a.last_name ) AS staff_name
      
  
FROM staff a
LEFT JOIN user_group b ON (a.user_group_id = b.user_group_id)
LEFT JOIN geo_country gc ON (a.address_country = gc.country_code)
WHERE a.staff_id != ''`,
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