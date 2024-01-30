"use strict";

var express = require('express');

var app = express();

var http = require('http');

var dotenv = require('dotenv').config();

var config = require('./config/config');

var functions = require('firebase-functions'); //const Bree = require('bree')


var morgan = require('morgan');

var db = require('./config/database');

var cors = require('cors');

var _require = require('./middlewares/language'),
    verifyLanguage = _require.verifyLanguage;

var server = http.createServer(app);
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(verifyLanguage);
/*const bree = new Bree({ jobs: [{ name: 'mail-report', interval: 'at 11:24pm' }]})
bree.start()*/

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/appointments'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/specialities'));
app.use('/api', require('./routes/experts'));
app.use('/api', require('./routes/seekers'));
app.use('/api', require('./routes/payments'));
app.use('/api', require('./routes/opening-times'));
app.use('/api', require('./routes/reviews'));
app.use('/api', require('./routes/expertVerifications'));
db().then(function (data) {
  return console.log('Mongo is up and running... ;)');
})["catch"](function (error) {
  return console.error(error);
});
app.get('/', function (request, response) {
  return response.status(200).json({
    message: "welcome to RA'AYA"
  });
}); //server.listen(config.PORT, () => console.log(`server started on port ${config.PORT} [RA'AYA APP]`))

exports.app = functions.https.onRequest(app);