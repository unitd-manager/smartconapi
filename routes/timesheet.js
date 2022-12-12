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
  db.query(`SELECT a.staff_id
  ,a.record_date
  ,a.type_of_leave
  ,a.latitude
  ,a.longitude
  ,a.notes
  ,a.time_in
  ,a.leave_time
  ,a.on_leave
  ,a.description
  ,a.created_by
  ,a.modified_by
  ,CONCAT_WS(' ', s.first_name, s.last_name) AS staff_name 
  ,s.team AS staff_team 
  FROM attendance a LEFT JOIN (staff s) ON (a.staff_id = s.staff_id)`,
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

app.post('/getTimeSheetByAttendanceId', (req, res, next) => {
  db.query(`SELECT a.staff_id
  ,a.record_date
  ,a.type_of_leave
  ,a.latitude
  ,a.longitude
  ,a.notes
  ,a.time_in
  ,a.leave_time
  ,a.description
  ,a.created_by
  ,a.modified_by
  ,CONCAT_WS(' ', s.first_name, s.last_name) AS staff_name 
  ,s.team AS staff_team 
  FROM attendance a LEFT JOIN (staff s) ON (a.staff_id = s.staff_id) 
  WHERE attendance_id = ${db.escape(req.body.attendance_id)}`,
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

app.post('/edit-timesheet', (req, res, next) => {
  db.query(`UPDATE attendance 
            SET staff_id=${db.escape(req.body.staff_id)}
            ,record_date=${db.escape(req.body.record_date)}
            ,type_of_leave=${db.escape(req.body.type_of_leave)}
            ,description=${db.escape(req.body.description)}}`,
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
app.post('/insertAttendance', (req, res, next) => {

  let data = {staff_id: req.body.staff_id
    , leave_time: req.body.leave_time
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , notes: req.body.notes
    , record_date: req.body.record_date
    , on_leave: req.body.on_leave
    , time_in: req.body.time_in
    , over_time: req.body.over_time
    , due_time: req.body.due_time
    , description: req.body.description
    , type_of_leave: req.body.type_of_leave
    , created_by: req.body.created_by
    , modified_by: req.body.modified_by
    , task: req.body.task
    , latitude: req.body.latitude
    , longitude: req.body.longitude};
  let sql = "INSERT INTO attendance SET ?";
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



app.delete('/deleteAttendance', (req, res, next) => {

  let data = {attendance_id:req.body.attendance_id   };
  let sql = "DELETE FROM attendance WHERE ?";
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

app.post('/editTimeSheet', (req, res, next) => {
  db.query(`UPDATE attendance 
            SET staff_id=${db.escape(req.body.staff_id)}
            ,record_date=${db.escape(req.body.record_date)}
            ,type_of_leave=${db.escape(req.body.type_of_leave)}
            ,notes=${db.escape(req.body.notes)}
            ,description=${db.escape(req.body.description)}
            WHERE attendance_id =  ${db.escape(req.body.attendance_id)}`,
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


app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;