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

app.get('/getTenders', (req, res, next) => {
  db.query(`SELECT 
  o.title
  ,o.office_ref_no
  ,o.company_id
  ,o.contact_id
  ,o.mode_of_submission
  ,o.services
  ,o.site_show_date
  ,o.site_show_attendee
  ,o.actual_submission_date
  ,o.status
  ,o.email
  ,o.price
  ,CONCAT_WS(' ', cont.first_name, cont.last_name) AS contact_name 
  ,CONCAT_WS(' ', ref.first_name, ref.last_name) AS ref_contact_name 
  ,c.company_name 
  ,c.company_size 
  ,c.source,c.industry 
  ,e.team,p.project_code,ser.title AS service_title 
  ,CONCAT_WS(' ', s.first_name, s.last_name) AS project_manager_name 
  FROM opportunity o 
  LEFT JOIN (contact cont) ON (o.contact_id = cont.contact_id)  
  LEFT JOIN (contact ref)  ON (o.referrer_contact_id = ref.contact_id) 
  LEFT JOIN (company c)  ON (o.company_id  = c.company_id)  
  LEFT JOIN (employee e)   ON (o.employee_id = e.employee_id)  
  LEFT JOIN (service ser)  ON (o.service_id  = ser.service_id)  
  LEFT JOIN (staff s)  ON (o.project_manager_id  = s.staff_id)  
  LEFT JOIN (valuelist VL) ON (o.chance  = VL.value AND VL.key_text = 'opportunityChance')   
  LEFT JOIN (project p)   ON (p.project_id   = o.project_id) 
  ORDER BY o.opportunity_code DESC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
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
  c.total_material_price,c.transport_charges,c.total_labour_charges,c.salesman_commission,c.finance_charges,c.office_overheads,c.other_charges,c.total_cost
  FROM opportunity_costing_summary c 
  WHERE c.opportunity_id != '' 
  ORDER BY c.opportunity_costing_summary_id DESC`,
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


app.get('/getTabCostingSummaryForm', (req, res, next) => {
  db.query(`SELECT c.no_of_worker_used,c.no_of_days_worked,c.labour_rates_per_day,c.po_price,c.profit_percentage,c.profit,c.total_material_price,c.transport_charges,c.total_labour_charges,c.salesman_commission,c.finance_charges,c.office_overheads,c.other_charges,c.total_cost FROM opportunity_costing_summary c WHERE c.opportunity_costing_summary_id != '' `,
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



app.post('/edit-TabCostingSummaryForm', (req, res, next) => {
  db.query(`UPDATE opportunity_costing_summary 
            SET no_of_worker_used=${db.escape(req.body.no_of_worker_used)}
            ,no_of_days_worked=${db.escape(req.body.no_of_days_worked)}
            ,labour_rates_per_day=${db.escape(req.body.labour_rates_per_day)}
            ,po_price=${db.escape(req.body.po_price)}
            ,transport_charges=${db.escape(req.body.transport_charges)}
            ,salesman_commission=${db.escape(req.body.salesman_commission)}
            ,office_overheads=${db.escape(req.body.office_overheads)}
            ,other_charges=${db.escape(req.body.other_charges)}
            ,total_cost =${db.escape(req.body.total_cost)}
            WHERE opportunity_costing_summary_id = ${db.escape(req.body.opportunity_costing_summary_id)}`,
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



app.get('/getTabquote', (req, res, next) => {
  db.query(` SELECT q.quote_date,q.quote_code,q.quote_status,q.project_location,q.project_reference,q.payment_method,q.revision,q.intro_drawing_quote FROM quote q  WHERE q.opportunity_id != ''  ORDER BY quote_code DESC
  `,
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


app.get('/getTabQuoteLine', (req, res, next) => {
  db.query(`SELECT qt.title
  ,qt.description
  ,qt.quantity
  ,qt.unit
  ,qt.unit_price
  ,qt.amount FROM quote_items qt 
  WHERE qt.opportunity_id != '' AND qt.quote_id != ''`,
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

app.post('/edit-TabQuoteLine', (req, res, next) => {
  db.query(`UPDATE quote_items
            SET title=${db.escape(req.body.title)}
            ,description=${db.escape(req.body.description)}
            ,quantity=${db.escape(req.body.quantity)}
            ,unit=${db.escape(req.body.unit)}
            ,unit_price=${db.escape(req.body.unit_price)}
            ,amount=${db.escape(req.body.amount)}
            WHERE opportunity_id =  ${db.escape(req.body.opportunity_id)}`,
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

app.post('/edit-Tenders', (req, res, next) => {
  db.query(`UPDATE opportunity 
            SET office_ref_no=${db.escape(req.body.office_ref_no)}
            ,company_id=${db.escape(req.body.company_id)}
            ,contact_id=${db.escape(req.body.contact_id)}
            ,mode_of_submission=${db.escape(req.body.mode_of_submission)}
            ,services=${db.escape(req.body.services)}
            ,site_show_date=${db.escape(req.body.site_show_date)}
            ,site_show_attendee=${db.escape(req.body.site_show_attendee)}
            ,actual_submission_date=${db.escape(req.body.actual_submission_date)}
            ,email=${db.escape(req.body.email)}
            ,price=${db.escape(req.body.price)}
            WHERE opportunity_id =  ${db.escape(req.body.opportunity_id)}`,
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

app.post('/getCostingSummaryById', (req, res, next) => {
  db.query(`SELECT 
            c.* 
            FROM opportunity_costing_summary c  
            WHERE c.opportunity_id =  ${db.escape(req.body.opportunity_id)}
            ORDER BY c.opportunity_costing_summary_id DESC`,
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

app.post('/getQuoteLineItemsById', (req, res, next) => {
  db.query(`SELECT
            qt.* 
            FROM quote_items qt 
            WHERE qt.quote_id =  ${db.escape(req.body.quote_id)}`,
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

app.post('/getQuoteById', (req, res, next) => {
  db.query(`SELECT
            q.* 
            FROM quote q 
            WHERE q.opportunity_id = ${db.escape(req.body.opportunity_id)}
            ORDER BY quote_code DESC`,
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

app.post('/insertTender', (req, res, next) => {

  let data = {title: req.body.title
    , company_id: req.body.company_id
    , contact_id: req.body.contact_id
    , category_id: req.body.category_id
    , office_ref_no: req.body.office_ref_no
    , mode_of_submission: req.body.mode_of_submission
    , services: req.body.services
    , site_show_date: req.body.site_show_date
    , site_show_attendee: req.body.site_show_attendee
    , actual_submission_date: req.body.actual_submission_date
    , status: req.body.status
    , email: req.body.email
    , price: req.body.price};
  let sql = "INSERT INTO opportunity SET ?";
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



app.post('/insertCompany', (req, res, next) => {

  let data = {company_name: req.body.company_name, website: req.body.website, phone: req.body.phone, fax: req.body.fax, address_flat: req.body.address_flat, address_street: req.body.address_street, address_po_code: req.body.address_po_code, address_country: req.body.address_country, supplier_type: req.body.supplier_type, industry: req.body.industry, company_size: req.body.company_size, source: req.body.source};
  let sql = "INSERT INTO company SET ?";
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



app.post('/insertContact', (req, res, next) => {

  let data = {salutation: req.body.salutation
    , first_name: req.body.first_name
    , email: req.body.email
    , position: req.body.position
    , department: req.body.department
    , phone_direct: req.body.phone_direct
    , fax: req.body.fax
    , mobile: req.body.mobile};
  let sql = "INSERT INTO contact SET ?";
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



app.post('/insertService', (req, res, next) => {

  let data = {service_id: req.body.service_id
    , title: req.body.title
    , service_code: req.body.service_code
    , description: req.body.description
    , price: req.body.price
    , creation_date: req.body.creation_date
    , modification_date: req.body.modification_date
    , flag: req.body.flag};
  let sql = "INSERT INTO service SET ?";
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



app.post('/insertStaff', (req, res, next) => {

  let data = {staff_id: req.body.staff_id
    , staff_rate: req.body.staff_rate
    , user_group_id: req.body.user_group_id
    , name: req.body.name
    , company_name: req.body.company_name
    , position: req.body.position
    , email: req.body.email
    , address_street: req.body.address_street
    , address_town: req.body.address_town
    , address_state: req.body.address_state
    , address_country: req.body.address_country
    , address_po_code: req.body.address_po_code
    , phone: req.body.phone
    , fax: req.body.fax
    , notes: req.body.notes
    , sort_order: req.body.sort_order
    , published: req.body.published
    , creation_date : req.body. creation_date 
    , modification_date: req.body.modification_date
    , protected: req.body.protected
    , user_name: req.body.user_name
    , pass_word: req.body.pass_word
    , first_name: req.body.first_name
    , last_name: req.body.last_name
    , mobile: req.body.mobile
    , religion: req.body.religion
    , address: req.body.address
    , relationship: req.body.relationship
    , known_as_name: req.body.known_as_name
    , address_street1: req.body.address_street1
    , address_town1: req.body.address_town1
    , address_country1: req.body.address_country1
    , flag: req.body.flag
    , sex: req.body.sex
    , date_of_birth: req.body.date_of_birth
    , random_no: req.body.random_no
    , login_count: req.body.login_count
    , member_status: req.body.member_status
    , team: req.body.team
    , section_name: req.body.section_name
    , staff_type: req.body.staff_type
    , status: req.body.status
    , content_update_alert: req.body.content_update_alert
    , show_sensitive_details: req.body.show_sensitive_details
    , current_status: req.body.current_status
    , developer : req.body. developer 
    , joined_date: req.body.joined_date
    , employee_id: req.body.employee_id};
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


app.delete('/deleteTender', (req, res, next) => {

  let data = {opportunity_id: req.body.opportunity_id};
  let sql = "DELETE FROM opportunity WHERE ?";
  let query = db.query(sql, data,(err, result) => {
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

app.post('/getQuotePDF', (req, res, next) => {
    db.query(`SELECT q.*
    ,qi.title AS quote_item_title
    ,qi.quantity
    ,qi.unit
    ,qi.description
    ,qi.amount
    ,qi.unit_price
    ,qi.remarks
    ,o.opportunity_id
    ,o.opportunity_code
    ,o.company_id
    ,c.company_name
    ,c.address_flat AS billing_address_flat
    ,c.address_street AS billing_address_street
    ,c.address_town AS billing_address_town
    ,c.address_state AS billing_address_state
    ,gc.name AS billing_address_country
    ,c.address_po_code AS billing_address_po_code
    ,c.company_id
    ,co.email
    ,c.phone
    ,c.fax
    ,c.mobile
    ,co.salutation
    ,co.first_name
    ,s.email AS employee_email
    ,e.mobile AS employee_mobile
  FROM quote q
  LEFT JOIN (quote_items qi) ON (qi.quote_id = q.quote_id)
  LEFT JOIN (opportunity o) ON (o.opportunity_id = q.opportunity_id)
  LEFT JOIN (company c) ON (c.company_id = o.company_id)
  LEFT JOIN (contact co) ON (co.contact_id = o.contact_id)
  LEFT JOIN (geo_country gc) ON (gc.country_code = c.address_country)
  LEFT JOIN (employee e) ON (e.employee_id = q.employee_id)
  LEFT JOIN (staff s) ON (s.employee_id = q.employee_id)
  WHERE q.quote_id = ${db.escape(req.body.quote_id)}
  ORDER BY qi.quote_items_id ASC`,
    (err, result) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      } 
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

app.post('/insertCostingSummary', (req, res, next) => {

  let data = {
    po_code: req.body.po_code
    , invoice_code: req.body.invoice_code
    , delivery_date: req.body.delivery_date
    , no_of_worker_used: req.body.no_of_worker_used
    , no_of_days_worked: req.body.no_of_days_worked
    , labour_rates_per_day: req.body.labour_rates_per_day
    , po_price: req.body.po_price
    , po_price_with_gst: req.body.po_price_with_gst
    , invoiced_price: req.body.invoiced_price
    , invoiced_price_with_gst: req.body.invoiced_price_with_gst
    , profit_percentage: req.body.profit_percentage
    , profit: req.body.profit
    , total_material_price: req.body.total_material_price
    , transport_charges: req.body.transport_charges
    , total_labour_charges: req.body.total_labour_charges
    , salesman_commission: req.body.salesman_commission
    , finance_charges: req.body.finance_charges
    , office_overheads: req.body.office_overheads
    , other_charges: req.body.other_charges
    , created_by: req.body.created_by
    , creation_date: req.body.creation_date
    , modified_by: req.body.modified_by
    , modification_date: req.body.modification_date
    , total_cost: req.body.total_cost
    , project_id: req.body.project_id
    , salesman_commission_percentage: req.body.salesman_commission_percentage
    , finance_charges_percentage: req.body.finance_charges_percentage
    , office_overheads_percentage: req.body.office_overheads_percentage
    , transport_charges_percentage: req.body.transport_charges_percentage
    };
  let sql = "INSERT INTO costing_summary SET ?";
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