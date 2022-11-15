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
       ,a.status
       ,a.user_group_id
       ,a.team
       ,a.staff_type
       ,a.staff_rate
       ,a.position
       ,a.published
       ,a.address_town
       ,a.address_state
       ,a.address_street
       ,a.address_country
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

  app.post('/editStaff', (req, res, next) => {
    db.query(`UPDATE staff
              SET first_name=${db.escape(req.body.first_name)}
              ,email=${db.escape(req.body.email)}
              ,status=${db.escape(req.body.status)}
              ,user_group_id=${db.escape(req.body.user_group_id)}
              ,team=${db.escape(req.body.team)}
              ,staff_type=${db.escape(req.body.staff_type)}
              ,staff_rate=${db.escape(req.body.staff_rate)}
              ,position=${db.escape(req.body.position)}
              ,published=${db.escape(req.body.published)}
              ,address_town=${db.escape(req.body.address_town)}
              ,address_state=${db.escape(req.body.address_state)}
              ,published=${db.escape(req.body.published)}
              ,published=${db.escape(req.body.published)}

              WHERE staff_id = ${db.escape(req.body.staff_id)}`,
              (err, result) => {
       
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                  } else {
                        return res.status(200).send({
                          data: result,
                          msg:'Tender has been removed successfully'
                        });
                  }
                });
              });

              app.post('/insertStaff', (req, res, next) => {

                let data = {staff_rate	:req.body.staff_rate	
                 , user_group_id	: req.body.user_group_id	
                 , name: req.body.name
                 , company_name: req.body.company_name
                 , position: req.body.position
                 , email	: req.body.email
                 , address_street	: req.body.address_street
                 , address_town: req.body.address_town
                 , address_state: req.body.address_state
                 , address_country: req.body.address_country
                 , address_po_code	: req.body.address_po_code	
                 , phone	: req.body.phone	
                 , fax	: req.body.fax	
                 , notes: req.body.notes
                 , sort_order: req.body.sort_order
                 , published: req.body.published
                 , creation_date: req.body.creation_date
                 , modification_date: req.body.modification_date
                 , protected	: req.body.protected
                 , user_name	: req.body.user_name
                 , pass_word: req.body.pass_word
                 , subscribe: req.body.subscribe
                 , first_name: req.body.first_name
                 , last_name: req.body.last_name
                 , mobile	: req.body.mobile	
                 , religion	: req.body.religion	
                 , address: req.body.address
                 , relationship: req.body.relationship
                 , known_as_name: req.body.known_as_name
                 , address_street1: req.body.address_street1
                 , address_town1	: req.body.address_town1
                 , address_country1	: req.body.address_country1
                 , sex: req.body.sex
                 , date_of_birth: req.body.date_of_birth
                 , random_no: req.body.random_no
                 , login_count: req.body.login_count
                 , member_status	: req.body.member_status	
                 , team	: req.body.team	
                 , section_name: req.body.section_name
                 , staff_type: req.body.staff_type
                 , status: req.body.status
                 , content_update_alert: req.body.content_update_alert
                 , show_sensitive_details	: req.body.show_sensitive_details
                 , current_status	: req.body.current_status
                 , developer: req.body.developer
                 , joined_date: req.body.joined_date
                 , employee_id: req.body.employee_id
                 
                  
               };
                let sql = "INSERT INTO staff SET ?";
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