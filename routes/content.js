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
app.get('/getContent', (req, res, next) => {
  db.query(`Select c.title
  , c.content_id
  ,s.section_id
  ,c.category_id
  ,c.sort_order
  ,c.sub_category_id
  ,c.content_type
  ,c.show_title
  ,c.published
  ,c.content_date 
  ,c.description
  ,c.creation_date
  ,c.modification_date 
  ,s.section_title
  ,ca.category_title
  ,sc.sub_category_title
  FROM content c
  LEFT JOIN section s ON s.section_id=c.section_id 
  LEFT JOIN category ca ON ca.category_id=c.category_id 
  LEFT JOIN sub_category sc ON sc.sub_category_id=sc.sub_category_id 
  WHERE c.content_id !='' ORDER BY c.sort_order ASC`,
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




app.post('/getContentById', (req, res, next) => {
  db.query(`Select c.title
  , c.content_id
  ,s.section_id
  ,c.category_id
  ,c.sort_order
  ,c.sub_category_id
  ,c.content_type
  ,c.show_title
  ,c.published 
  ,c.content_date 
  ,c.description
  ,c.creation_date
  ,c.modification_date 
  ,s.section_title
  ,ca.category_title
  ,sc.sub_category_title
  FROM content c
  LEFT JOIN section s ON s.section_id=c.section_id 
  LEFT JOIN category ca ON ca.category_id=c.category_id 
  LEFT JOIN sub_category sc ON sc.sub_category_id=sc.sub_category_id 
  WHERE content_id = ${db.escape(req.body.content_id)} `,
    (err, result) => {
      if (err) {
         return res.status(400).send({
              data: err,
              msg:'Failed'
            });
      } else {
            return res.status(200).send({
              data: result[0],
              msg:'Success'
            });

      }

  }
 );
});


app.post('/editContent', (req, res, next) => {
  db.query(`UPDATE content
            SET title=${db.escape(req.body.title)}
            ,section_id=${db.escape(req.body.section_id)}
            ,category_id=${db.escape(req.body.category_id)}
            ,sub_category_id=${db.escape(req.body.sub_category_id)}
            ,content_type=${db.escape(req.body.content_type)}
            ,show_title=${db.escape(req.body.show_title)}
            ,published=${db.escape(req.body.published)}
            ,content_date=${db.escape(req.body.content_date)}
            ,description=${db.escape(req.body.description)}
            WHERE content_id = ${db.escape(req.body.content_id)}`,
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




app.post('/insertContent', (req, res, next) => {

  let data = {
      section_id: req.body.section_id
    , category_id: req.body.category_id
    , sub_category_id: req.body.sub_category_id
    , author_id: req.body.author_id
    , title: req.body.title
    , show_title: req.body.show_title
    , type: req.body.type
    , description_short: req.body.description_short
    , description: req.body.description
    , sort_order: req.body.sort_order
    , published: req.body.published
    , member_only: req.body.member_only
    , latest: req.body.latest
    , favourite: req.body.favourite
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , content_date: req.body.content_date
    , chi_title: req.body.chi_title
    , chi_description: req.body.chi_description
    , content_type: req.body.content_type
    , external_link: req.body.external_link
    , meta_title: req.body.meta_title
    , meta_keyword: req.body.meta_keyword
    , meta_description: req.body.meta_description
    , flag: req.body.flag
    , published_test: req.body.published_test
    , email_alert_required: req.body.email_alert_required
    , staff_id: req.body.staff_id
    , comment_alert: req.body.comment_alert
    , internal_link: req.body.internal_link
 };
  let sql = "INSERT INTO content SET ?";
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


app.post('/deleteContent', (req, res, next) => {

  let data = {content_id : req.body.content_id };
  let sql = "DELETE FROM content  WHERE ?";
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

app.get('/getSection', (req, res, next) => {
  db.query(`SELECT section_id,section_title
  FROM section`,
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

app.get('/getCategory', (req, res, next) => {
  db.query(`SELECT
  category_title,category_id
   From category 
   WHERE category_id != ''`,
    (err, result) => {
       
      if (err) {
        console.log("error: ", err);
        return;
      } else {
            return res.status(200).send({
              data: result,
              msg:'Category has been get successfully'
            });
      }
 }
 );
});

// app.get('/getCategory', (req, res, next) => {
//   db.query(`SELECT category_id
//   ,category_title
//    FROM category 
//     where category_id !=''`,
//     (err, result) => {
//       if (err) {
//         console.log("error: ", err);
//         return;
//       } else {
//             return res.status(200).send({
//               data: result,
//               msg:'Success'
//             });

//         }
 
//     }
//   );
// });



app.get('/getSubCategory', (req, res, next) => {
  db.query(`SELECT sub_category_id,sub_category_title
  FROM sub_category`,
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