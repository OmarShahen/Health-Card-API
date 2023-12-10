"use strict";

var express = require('express');

var app = express();

var dotenv = require('dotenv').config();

var config = require('./config/config');

var functions = require('firebase-functions'); //const Bree = require('bree')


var morgan = require('morgan');

var db = require('./config/database');

var cors = require('cors'); //const http = require('http').Server(app)


var _require = require('./middlewares/language'),
    verifyLanguage = _require.verifyLanguage;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(verifyLanguage);
/*const bree = new Bree({ jobs: [{ name: 'mail-report', interval: 'at 11:24pm' }]})
bree.start()*/

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/patients'));
app.use('/api', require('./routes/clinics'));
app.use('/api', require('./routes/encounters'));
app.use('/api', require('./routes/prescriptions'));
app.use('/api', require('./routes/appointments'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/clinics-patients'));
app.use('/api', require('./routes/visit-reasons'));
app.use('/api', require('./routes/specialities'));
app.use('/api', require('./routes/clinics-owners'));
app.use('/api', require('./routes/clinics-doctors'));
app.use('/api', require('./routes/doctors'));
app.use('/api', require('./routes/clinics-patients-doctors'));
app.use('/api', require('./routes/clinics-requests'));
app.use('/api', require('./routes/services'));
app.use('/api', require('./routes/invoices'));
app.use('/api', require('./routes/invoices-services'));
app.use('/api', require('./routes/staffs'));
app.use('/api', require('./routes/cards'));
app.use('/api', require('./routes/payments'));
app.use('/api', require('./routes/subscriptions'));
app.use('/api', require('./routes/insurances'));
app.use('/api', require('./routes/insurancePolicies'));
app.use('/api', require('./routes/file-storage/folders'));
app.use('/api', require('./routes/file-storage/files'));
app.use('/api', require('./routes/arrival-methods'));
app.use('/api', require('./routes/opening-times'));
app.use('/api', require('./routes/followup-service/clinics-subscriptions'));
app.use('/api', require('./routes/followup-service/patients-surveys'));
app.use('/api', require('./routes/followup-service/treatments-surveys'));
app.use('/api', require('./routes/labels/labels'));
app.use('/api', require('./routes/medication-challenges/medication-challenges'));
app.use('/api', require('./routes/followup-service/comments'));
app.use('/api', require('./routes/values'));
app.use('/api', require('./routes/CRM/leads'));
app.use('/api', require('./routes/CRM/meetings'));
app.use('/api', require('./routes/CRM/stages'));
app.use('/api', require('./routes/CRM/messagesTemplates'));
app.use('/api', require('./routes/CRM/messagesSent'));
app.use('/api', require('./routes/analytics'));
db().then(function (data) {
  return console.log('Mongo is up and running... ;)');
})["catch"](function (error) {
  return console.error(error);
});
app.get('/', function (request, response) {
  return response.status(200).json({
    message: "welcome to RA'AYA"
  });
});
app.listen(config.PORT, function () {
  return console.log("server started on port ".concat(config.PORT, " [HEALTH CARD-APP]"));
});
exports.app = functions.https.onRequest(app);