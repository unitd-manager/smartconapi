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

app.get('/getTimeSheet', (req, res, next) => {
  db.query("SELECT a.staff_id,a.record_date,a.type_of_leave,a.latitude,a.longitude,a.notes,a.time_in,a.leave_time,a.description,CONCAT_WS(' ', s.first_name, s.last_name) AS staff_name ,s.team AS staff_team FROM attendance a LEFT JOIN (staff s) ON (a.staff_id = s.staff_id) WHERE attendance_id = ''",
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



app.post('/editTimeSheet', (req, res, next) => {
  db.query(`UPDATE attendance 
            SET staff_id=${db.escape(req.body.staff_id)}
            ,record_date=${db.escape(req.body.record_date)}
            ,type_of_leave=${db.escape(req.body.type_of_leave)}
            ,notes=${db.escape(req.body.notes)}
            ,description=${db.escape(req.body.description)}
            WHERE attendance_id =  ${db.escape(req.body.attendance_id)}`,
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