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
  db.query("SELECT p.title,p.category,p.status,p.contact_id,p.start_date,p.estimated_finish_date,p.description,p.project_manager_id, CONCAT_WS(' ', cont.first_name, cont.last_name) AS contact_name ,c.company_name ,c.company_size ,c.source ,c.industry ,o.opportunity_code ,( SELECT GROUP_CONCAT( CONCAT_WS(' ', stf.first_name, stf.last_name) ORDER BY CONCAT_WS(' ', stf.first_name, stf.last_name) SEPARATOR ', ' ) FROM staff stf ,project_staff ts WHERE ts.project_id = p.project_id AND stf.staff_id = ts.staff_id ) AS staff_name ,ser.title as service_title ,CONCAT_WS(' ', s.first_name, s.last_name) AS project_manager_name ,(p.project_value - (IF(ISNULL(( SELECT SUM(invoice_amount) FROM invoice i LEFT JOIN (`order` o) ON (i.order_id = o.order_id) WHERE o.project_id = p.project_id AND LOWER(i.status) != 'cancelled' ) ),0, ( SELECT SUM(invoice_amount) FROM invoice i LEFT JOIN (`order` o) ON (i.order_id = o.order_id) WHERE o.project_id = p.project_id AND LOWER(i.status) != 'cancelled' ) ))) AS still_to_bill FROM project p LEFT JOIN (contact cont)  ON (p.contact_id         = cont.contact_id) LEFT JOIN (company c)     ON (p.company_id         = c.company_id) LEFT JOIN (service ser)   ON (p.service_id         = ser.service_id) LEFT JOIN (staff   s)     ON (p.project_manager_id = s.staff_id) LEFT JOIN (opportunity o) ON (p.opportunity_id     = o.opportunity_id) WHERE ( LOWER(p.status) = 'wip' OR LOWER(p.status) = 'billable' OR LOWER(p.status) = 'billed' ) AND ( LOWER(p.status) = 'wip' OR LOWER(p.status) = 'billable' OR LOWER(p.status) = 'billed' ) ORDER BY p.project_code DESC",
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
app.get('/getCostingSummary', (req, res, next) => {
  db.query("SELECT c.no_of_worker_used FROM opportunity_costing_summary c WHERE c.opportunity_id =  ORDER BY c.opportunity_costing_summary_id DESC",
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

app.get('/getTabQuote', (req, res, next) => {
  db.query(`SELECT 
  q.quote_date
  ,q.quote_status
  ,q.project_location
  ,q.project_reference
  ,q.payment_method
  ,q.ref_no_quote
  ,q.revision
  ,q.drawing_nos
  ,q.condition FROM quote q 
  LEFT JOIN (project p) ON (p.project_id = q.project_id) WHERE p.project_id != '' ORDER BY q.quote_code DESC;`,
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

app.get('/SalemanCommission', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "salesman commission" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editSalesmanCommission', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/TotalLabourCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "total labour charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editTotalLabourCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/FinanceCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "finance charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editFinanceCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/OtherCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "other charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editOtherCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/TransportCharges', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "transport charges" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editTransportCharges', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.get('/OfficeOverHeads', (req, res, next) => {
  db.query(`SELECT 
  a.date
  ,a.amount
  ,a.title
  ,a.description FROM actual_costing_summary a WHERE title = "office overheads" AND project_id = ${db.escape(req.body.project_id)};`,
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

app.post('/editOfficeOverHeads', (req, res, next) => {
  db.query(`UPDATE actual_costing_summary
            SET date=${db.escape(req.body.date)}
            ,amount=${db.escape(req.body.company_id)}
            ,description=${db.escape(req.body.contact_id)}
            ,title=${db.escape(req.body.mode_of_submission)}
            WHERE title =  ${db.escape(req.body.title)} AND project_id = ${db.escape(req.body.project_id)}`,
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

app.post('/insertQuote', (req, res, next) => {

  let data = {
     opportunity_id: req.body.opportunity_id
    , project_id: req.body.project_id
    , quote_code: req.body.quote_code
    , quote_date: req.body.quote_date
    , quote_status: req.body.quote_status
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , currency_item: req.body.currency_item
    , note: req.body.note
    , condition: req.body.condition
    , quote_type: req.body.quote_type
    , quote_sequence: req.body.quote_sequence
    , template: req.body.template
    , template_title: req.body.template_title
    , created_by: req.body.created_by
    , sign_staff_id: req.body.sign_staff_id
    , flag: req.body.flag
    , sort_order: req.body.sort_order
    , modified_by: req.body.modified_by
    , title: req.body.title
    , signatory_name: req.body.signatory_name
    , signatory_position: req.body.signatory_position
    , quote_code_user: req.body.quote_code_user
    , quote_intro_text_1: req.body.quote_intro_text_1
    , invoices_payment_terms: req.body.invoices_payment_terms
    , responsibility: req.body.responsibility
    , provision_by_client: req.body.provision_by_client
    , provision_by_krs: req.body.provision_by_krs
    , monday_to_friday_normal_timing: req.body.monday_to_friday_normal_timing
    , saturday_normal_timing: req.body.saturday_normal_timing
    , monday_to_friday_ot_timing: req.body.monday_to_friday_ot_timing
    , saturday_ot_timing: req.body.saturday_ot_timing
    , sunday_and_publicholiday_ot_timing: req.body.sunday_and_publicholiday_ot_timing
    , timesheet_type: req.body.timesheet_type
    , site_address: req.body.site_address
    , project_location: req.body.project_location
    , project_reference: req.body.project_reference
    , discount: req.body.discount
    , gst: req.body.gst
    , payment_method: req.body.payment_method
    , drawing_nos: req.body.drawing_nos
    , intro_quote: req.body.intro_quote
    , our_reference: req.body.our_reference
    , total_amount: req.body.total_amount
    , revision: req.body.revision
    , employee_id: req.body.employee_id
    , ref_no_quote: req.body.ref_no_quote
    , intro_drawing_quote: req.body.intro_drawing_quote
    , show_project_manager: req.body.show_project_manager
  };
  let sql = "INSERT INTO quote SET ?";
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


app.post('/TabQuote', (req, res, next) => {
  db.query(`UPDATE quote
            SET  quote_date=${db.escape(req.body.quote_date)}
            ,discount=${db.escape(req.body.discount)}
            ,project_location=${db.escape(req.body.project_location)}
            ,project_reference=${db.escape(req.body.project_reference)}
            ,ref_no_quote=${db.escape(req.body.ref_no_quote)}
            ,revision=${db.escape(req.body.revision)}
            WHERE  project_id = ${db.escape(req.body.project_id)}`,
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


app.get('/getTabQuoteLineItems', (req, res, next) => {
  db.query(`SELECT 
  qt.title
  ,qt.description
  ,qt.quantity
  ,qt.unit
  ,qt.unit_price
  ,qt.amount FROM quote_items qt WHERE qt.opportunity_id != '' AND qt.quote_id != ''`,
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

app.post('/editTabQuoteLineItems', (req, res, next) => {
  db.query(`UPDATE quote_items
            SET title=${db.escape(req.body.title)}
            ,description=${db.escape(req.body.description)}
            ,quantity=${db.escape(req.body.quantity)}
            ,unit=${db.escape(req.body.unit)}
            ,unit_price=${db.escape(req.body.unit_price)}
            ,amount=${db.escape(req.body.amount)}
            WHERE opportunity_id = ${db.escape(req.body.opportunity_id)}  AND quote_id =${db.escape(req.body.quote_id)}`,
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


app.get('/getTabCostingSummary', (req, res, next) => {
  db.query(`SELECT 
  c.no_of_worker_used
  ,c.no_of_days_worked
  ,c.labour_rates_per_day
  ,c.po_price
  ,c.po_price_with_gst
  ,c.profit_percentage
  ,c.profit
  ,c.total_material_price
  ,c.transport_charges
  ,c.total_labour_charges
  ,c.salesman_commission
  ,c.finance_charges
  ,c.office_overheads
  ,c.other_charges
  ,c.total_cost of FROM costing_summary c WHERE c.project_id != '' ORDER BY c.costing_summary_id DESC`,
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