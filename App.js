var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var https = require('https');
const fileUpload = require('express-fileupload');

var privateKey  = fs.readFileSync('sslcrt/server.key', 'utf8');
var certificate = fs.readFileSync('sslcrt/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(3001);
httpsServer.listen(3002);
    
var bodyParser = require('body-parser');
var cors = require('cors');
const _ = require('lodash');
const mime = require('mime-types')

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
const project = require('./routes/project.js');
const tender = require('./routes/tender.js');
const Arouter = require('./routes/attachment.js');
const employee = require('./routes/employee.js');
const booking = require('./routes/booking.js');
const timesheet = require('./routes/timesheet.js');
const product = require('./routes/product.js');
const supplier = require('./routes/supplier.js');
const subcon = require('./routes/subcon.js');
const tabcostingsummary = require('./routes/tabcostingsummary.js');
const quotation = require('./routes/quotation.js');
const invoice = require('./routes/invoice.js');
const finance = require('./routes/finance.js');
const tabsubconworkorder = require('./routes/tabsubconworkorder.js');
const tabfinanaceportal = require('./routes/tabfinanaceportal.js');
const purchaseorder = require('./routes/purchaseorder.js');
const materialpurchased = require('./routes/materialpurchased.js');
const company = require('./routes/company.js');
const employeesportal = require('./routes/employeesportal.js');
const claim = require('./routes/claim.js');
const loan = require('./routes/loan.js');
const training = require('./routes/training.js');
const usergroup = require('./routes/usergroup.js');




app.use('/project', project);
app.use('/tender', tender);
app.use('/attachment', Arouter);
app.use('/employee', employee);
app.use('/booking', booking);
app.use('/timesheet', timesheet);
app.use('/product', product);
app.use('/supplier', supplier);
app.use('/subcon', subcon);
app.use('/tabcostingsummary', tabcostingsummary);
app.use('/quotation', quotation);
app.use('/invoice', invoice);
app.use('/finance', finance);
app.use('/tabsubconworkorder', tabsubconworkorder);
app.use('/tabfinanaceportal', tabfinanaceportal);
app.use('/purchaseorder', purchaseorder);
app.use('/materialpurchased', materialpurchased);
app.use('/company', company);
app.use('/employeesportal', employeesportal);
app.use('/claim', claim);
app.use('/loan', loan);
app.use('/training', training);
app.use('/usergroup', usergroup);




app.use(fileUpload({
    createParentPath: true
}));
module.exports = app;