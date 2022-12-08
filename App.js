var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');
var https = require('https');
const fileUpload = require('express-fileupload');
var flash = require('connect-flash')
const session = require('express-session');

global.__basedir = __dirname;

var privateKey  = fs.readFileSync('sslcrt/server.key', 'utf8');
var certificate = fs.readFileSync('sslcrt/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
let port = 3001;
let secureport = 3002;
httpServer.listen(port, () => {
    console.log(`Server Running in port:${port}`);
  });
httpsServer.listen(secureport, () => {
    console.log(`Server Running in secure port:${secureport}`);
  });
    
var bodyParser = require('body-parser');
var cors = require('cors');
const _ = require('lodash');
const mime = require('mime-types')

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
	secret: 'my_secret',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash());

const project = require('./routes/project.js');
const tender = require('./routes/tender.js');
const Arouter = require('./routes/attachment.js');
const employee = require('./routes/employee.js');
const booking = require('./routes/booking.js');
const timesheet = require('./routes/timesheet.js');
const product = require('./routes/product.js');
const supplier = require('./routes/supplier.js');
const subcon = require('./routes/subcon.js');
const projecttabcostingsummary = require('./routes/projecttabcostingsummary.js');
const invoice = require('./routes/invoice.js');
const finance = require('./routes/finance.js');
const projecttabsubconworkorder = require('./routes/projecttabsubconworkorder.js');
const projecttabfinanaceportal = require('./routes/projecttabfinanaceportal.js');
const purchaseorder = require('./routes/purchaseorder.js');
const company = require('./routes/company.js');
const projectemployeesportal = require('./routes/projectemployeesportal.js');
const projecttabclaimportal = require('./routes/projecttabclaimportal.js');
const inventory = require('./routes/inventory.js');
const cpfcalculator = require('./routes/cpfcalculator.js');
const payrollmanagement = require('./routes/payrollmanagement.js');
const loan = require('./routes/loan.js');
const training = require('./routes/training.js');
const usergroup = require('./routes/usergroup.js');
const employeeModule = require('./routes/employeeModule.js');
const jobinformation = require('./routes/jobinformation.js');
const accounts = require('./routes/accounts.js');
const clients = require('./routes/clients.js');
const expensehead = require('./routes/expensehead.js');
const setting = require('./routes/setting.js');
const valuelist = require('./routes/valuelist.js');
const staff = require('./routes/staff.js');
const projecttabmaterialusedportal = require('./routes/projecttabmaterialusedportal.js');
const projecttabmaterialstransferredportal = require('./routes/projecttabmaterialstransferredportal.js');
const projecttabdeliveryorder = require('./routes/projecttabdeliveryorder.js');
const media = require('./routes/media.js');
const projecttabmaterialrequest = require('./routes/projecttabmaterialrequest.js');
const materialpurchaseorder = require('./routes/materialpurchaseorder.js');
const leave = require('./routes/leave.js');




app.use('/project', project);
app.use('/tender', tender);
app.use('/attachment', Arouter);
app.use('/employee', employee);
app.use('/booking', booking);
app.use('/timesheet', timesheet);
app.use('/product', product);
app.use('/supplier', supplier);
app.use('/subcon', subcon);
app.use('/projecttabcostingsummary', projecttabcostingsummary);
app.use('/invoice', invoice);
app.use('/finance', finance);
app.use('/projecttabsubconworkorder', projecttabsubconworkorder);
app.use('/projecttabfinanaceportal', projecttabfinanaceportal);
app.use('/purchaseorder', purchaseorder);
app.use('/company', company);
app.use('/projectemployeesportal', projectemployeesportal);
app.use('/projecttabclaimportal', projecttabclaimportal);
app.use('/inventory', inventory);
app.use('/cpfcalculator', cpfcalculator);
app.use('/payrollmanagement', payrollmanagement);
app.use('/loan', loan);
app.use('/training', training);
app.use('/usergroup', usergroup);
app.use('/employeeModule', employeeModule);
app.use('/jobinformation', jobinformation);
app.use('/accounts', accounts);
app.use('/clients', clients);
app.use('/expensehead', expensehead);
app.use('/setting', setting);
app.use('/valuelist', valuelist);
app.use('/staff', staff);
app.use('/projecttabmaterialusedportal',projecttabmaterialusedportal);
app.use('/projecttabmaterialstransferredportal',projecttabmaterialstransferredportal);
app.use('/projecttabdeliveryorder', projecttabdeliveryorder);
app.use('/media', media);
app.use('/projecttabmaterialrequest', projecttabmaterialrequest);
app.use('/materialpurchaseorder', materialpurchaseorder);
app.use('/leave', leave);




const indexRouter = require('./routes/fileUpload'); 
app.use('/file', indexRouter);

app.use(fileUpload({
    createParentPath: true
}));
module.exports = app;