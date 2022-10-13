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

app.use('/project', project);
app.use('/tender', tender);
app.use('/attachment', Arouter);
app.use('/employee', employee);
app.use('/booking', booking);
app.use('/timesheet', timesheet);
app.use('/product', product);
app.use('/supplier', supplier);

app.use(fileUpload({
    createParentPath: true
}));
module.exports = app;