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
app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send('This is the secret content. Only logged in users can see that!');
});

module.exports = app;