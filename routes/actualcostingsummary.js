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



app.get('/getCostingSummary', (req, res, next) => {
  db.query(`SELECT c.no_of_worker_used FROM opportunity_costing_summary c WHERE c.opportunity_id =  ORDER BY c.opportunity_costing_summary_id DESC`,
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



app.get('/SalemanCommission', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "salesman commission" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editSalesmanCommission', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
    (err, result) =>{
      if (err) {
        console.log("error: ", err);
        return;
      }else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });
      }
     }
  );
});

app.get('/TotalLabourCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "total labour charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editTotalLabourCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        return;
      }else {
            return res.status(200).send({
              data: result,
              msg:'Success'
            });
      }
     }
  );
});

app.get('/FinanceCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "finance charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editFinanceCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/OtherCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "other charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editOtherCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/TransportCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "transport charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editTransportCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/OfficeOverHeads', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "office overheads" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editOfficeOverHeads', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.post('/insertProjectStaff', (req, res, next) => {

  let data = {
    creation_date:req.body.creation_date
     ,modification_date: req.body.modification_date
    , active_in_project: req.body.active_in_project
     };
  let sql = "INSERT INTO project_staff SET ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'New Tender has been created successfully'
          });
    }
  });
});

app.delete('/deleteProjectStaff', (req, res, next) => {

  let data = {creation_date: req.body.creation_date};
  let sql = "DELETE FROM project_staff WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Tender has been removed successfully'
          });
    }
  });
});


app.post('/insertThirdParty', (req, res, next) => {

  let data = {
    item_title:req.body.item_title
     ,budget_amount: req.body.budget_amount
    , actual_amount: req.body.actual_amount
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , sort_order: req.body.sort_order
    , published: req.body.published
    , flag: req.body.flag

  };
  let sql = "INSERT INTO third_party_cost SET ?";
  let query = db.query(sql, data,(err, result) =>{
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'New Tender has been created successfully'
          });
    }
  });
});

app.delete('/deleteThirdPartyCost', (req, res, next) => {

  let data = {item_title: req.body.item_title};
  let sql = "DELETE FROM third_party_cost WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Tender has been removed successfully'
          });
    }
  });
});



app.post('/insertActualCostingSummary', (req, res, next) => {

  let data = {title:req.body.title
    ,date: req.body.date
    , amount: req.body.amount
    , description: req.body.description
    , project_id: req.body.project_id
    , costing_summary_id: req.body.costing_summary_id
    , created_by: req.body.created_by
    , creation_date: req.body.creation_date
    , modified_by: req.body.modified_by
    , modification_date: req.body.modification_date };
  let sql = "INSERT INTO actual_costing_summary SET ?";
  let query = db.query(sql, data,(err, result) =>{
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'New Tender has been created successfully'
          });
    }
  });
});

app.delete('/deleteActualCostingSummary', (req, res, next) => {

  let data = {actual_costing_summary_id: req.body.actual_costing_summary_id};
  let sql = "DELETE FROM actual_costing_summary WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
      console.log("error: ", err);
      return;
    } else {
          return res.status(200).send({
            data: result,
            msg:'Tender has been removed successfully'
          });
    }
  });
});


app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;