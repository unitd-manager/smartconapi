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

app.get('/getProjects', (req, res, next) => {
  db.query(`SELECT p.title
  ,p.category
  ,p.status
  ,p.contact_id
  ,p.start_date
  ,p.estimated_finish_date
  ,p.description
  ,p.project_manager_id
  ,CONCAT_WS(' ', cont.first_name, cont.last_name) AS contact_name 
  ,c.company_name 
  ,c.company_size 
  ,c.source ,c.industry 
  ,o.opportunity_code 
  ,( SELECT GROUP_CONCAT( CONCAT_WS(' ', stf.first_name, stf.last_name) 
  ORDER BY CONCAT_WS(' ', stf.first_name, stf.last_name) SEPARATOR ', ' ) 
  FROM staff stf ,project_staff ts 
  WHERE ts.project_id = p.project_id AND stf.staff_id = ts.staff_id ) 
  AS staff_name ,ser.title as service_title ,CONCAT_WS(' ', s.first_name, s.last_name) 
  AS project_manager_name ,(p.project_value - (IF(ISNULL(( SELECT SUM(invoice_amount) 
  FROM invoice i LEFT JOIN (orders o) ON (i.order_id = o.order_id)
 WHERE o.project_id = p.project_id AND LOWER(i.status) != 'cancelled' ) ),0, ( SELECT SUM(invoice_amount) 
  FROM invoice i LEFT JOIN (orders o) ON (i.order_id = o.order_id) 
  WHERE o.project_id = p.project_id AND LOWER(i.status) != 'cancelled' ) ))) AS still_to_bill FROM project p LEFT JOIN (contact cont) ON (p.contact_id = cont.contact_id)LEFT JOIN (company c)ON (p.company_id = c.company_id) 
  LEFT JOIN (service ser) ON (p.service_id = ser.service_id) LEFT JOIN (staff s) ON (p.project_manager_id = s.staff_id) LEFT JOIN (opportunity o) ON (p.opportunity_id = o.opportunity_id) WHERE ( LOWER(p.status) = 'wip' OR LOWER(p.status) = 'billable' OR LOWER(p.status) = 'billed' ) AND ( LOWER(p.status) = 'wip' OR LOWER(p.status) ='billable' OR LOWER(p.status) = 'billed') ORDER BY p.project_code DESC`,
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


app.post('/edit-Project', (req, res, next) => {
  db.query(`UPDATE project 
            SET title=${db.escape(req.body.title)}
            ,category=${db.escape(req.body.category)}
            ,status=${db.escape(req.body.status)}
            ,contact_id=${db.escape(req.body.contact_id)}
            ,start_date=${db.escape(req.body.start_date)}
            ,estimated_finish_date=${db.escape(req.body.estimated_finish_date)}
            ,description=${db.escape(req.body.description)}
            ,project_manager_id=${db.escape(req.body.project_manager_id)}
            WHERE project_id =  ${db.escape(req.body.project_id)}`,
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

app.post('/insertOrder', (req, res, next) => {

  let data = {order_status: req.body.order_status,
    payment_method: req.body.payment_method,
    shipping_first_name: req.body.shipping_first_name,
    shipping_last_name: req.body.shipping_last_name,
    shipping_email: req.body.shipping_email,
    shipping_address1: req.body.shipping_address1,
    shipping_address2: req.body.shipping_address2,
    shipping_address_city: req.body.shipping_address_city,
    shipping_address_area: req.body.shipping_address_area,
    shipping_address_state: req.body.shipping_address_state,
    shipping_address_country_code: req.body.shipping_address_country_code,
    shipping_address_po_code: req.body.shipping_address_po_code,
    shipping_phone: req.body.shipping_phone,
    cust_first_name: req.body.cust_first_name,
    cust_last_name: req.body.cust_last_name,
    cust_email: req.body.cust_email,
    cust_address1: req.body.cust_address1,
    cust_address2: req.body.cust_address2,
    cust_address_city: req.body.cust_address_city,
    cust_address_area: req.body.cust_address_area,
    cust_address_state: req.body.cust_address_state,
    cust_address_country: req.body.cust_address_country,
    cust_address_po_code: req.body.cust_address_po_code,
    cust_phone: req.body.cust_phone,
    memo: req.body.memo,
    creation_date: req.body.creation_date,
    modification_date: req.body.modification_date,
    flag: req.body.flag,
    record_type: req.body.record_type,
    module: req.body.module,
    currency: req.body.currency,
    order_date: req.body.order_date,
    order_code: req.body.order_code,
    shipping_charge: req.body.shipping_charge,
    add_gst_to_total: req.body.add_gst_to_total,
    invoice_terms: req.body.invoice_terms,
    notes: req.body.notes,
    shipping_address_country: req.body.shipping_address_country,
    address_country: req.body.address_country,
    delivery_to_text: req.body.delivery_to_text,
    created_by: req.body.created_by,
    modified_by: req.body.modified_by,
    discount: req.body.discount,
    name_of_company: req.body.name_of_company,
    vat: req.body.vat,
    cust_company_name: req.body.cust_company_name,
    site_id: req.body.site_id,
    manual_invoice: req.body.manual_invoice,
    apply_general_vat: req.body.apply_general_vat,
    link_stock: req.body.link_stock,
    selling_company: req.body.selling_company,
    link_account: req.body.link_account,
    project_id: req.body.project_id,
    start_date : req.body. start_date ,
    end_date: req.body.end_date,
    auto_create_invoice: req.body.auto_create_invoice,
    delivery_date: req.body.delivery_date,
    delivery_terms: req.body.delivery_terms,
    quote_title: req.body.quote_title,
    project_type: req.body.project_type,
    cust_fax: req.body.cust_fax,
    shipping_fax: req.body.shipping_fax};

  let sql = "INSERT INTO orders SET ?";
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



app.delete('/deleteorders', (req, res, next) => {

  let data = {order_id  : req.body.order_id,};
  let sql = "DELETE FROM orders WHERE ?";
  let query = db.query(sql, data,(err, result) => {
    if (err) {
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








app.post('/insertProject', (req, res, next) => {

  let data = {title: req.body.title
    , description: req.body.description
    , published: req.body.published
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , content_date: req.body.content_date
    , service_id: req.body.service_id
    , contact_id: req.body.contact_id
    , task_id : req.body. task_id 
    , enquiry_date: req.body.enquiry_date
    , follow_up_date: req.body.follow_up_date
    , start_date: req.body.start_date
    , estimated_finish_date: req.body.estimated_finish_date
    , actual_finish_date: req.body.actual_finish_date
    , project_value: req.body.project_value
    , notes: req.body.notes
    , project_code: req.body.project_code
    , status: req.body.status
    , staff_id: req.body.staff_id
    , project_manager_id: req.body.project_manager_id
    , per_completed: req.body.per_completed
    , opportunity_id: req.body.opportunity_id
    , category: req.body.category
    , percent_used: req.body.percent_used
    , invoice: req.body.invoice
    , quote_ref: req.body.quote_ref
    , client_type: req.body.client_type
    , difficulty: req.body.difficulty
    , created_by: req.body.created_by
    , modified_by: req.body.modified_by
    , flag: req.body.flag
    , deposit_inv_ref: req.body.deposit_inv_ref
    , project_commission: req.body.project_commission
    , payment_terms: req.body.payment_terms
    , confirmed_quote_id: req.body.confirmed_quote_id
    , target_left: req.body.target_left
    , budget_inhouse: req.body.budget_inhouse
    , budget_third_party: req.body.budget_third_party
    , used_third_party: req.body.used_third_party
    , used_inhouse: req.body.used_inhouse
    , net_third_party: req.body.net_third_party
    , stage: req.body.stage
    , currency: req.body.currency
    , branch_id: req.body.branch_id
    , project_value_base: req.body.project_value_base
    ,  project_value_ref : req.body. project_value_ref 
    , paid_on: req.body.paid_on
    , quote_id: req.body.quote_id
    , site: req.body.site
  };
  let sql = "INSERT INTO project SET ?";
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


app.delete('/deleteProject', (req, res, next) => {

  let data = {project_id : req.body.project_id };
  let sql = "DELETE FROM project WHERE ?";
  let query = db.query(sql, data,(err, result) =>{
    if (err) {
      console.log("error: ", err);
      return;
    }else {
          return res.status(200).send({
            data: result,
            msg:'Tender has been removed successfully'
          });
    }
  });
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




app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;