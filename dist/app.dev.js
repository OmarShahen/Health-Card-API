"use strict";

var express = require('express');

var app = express();

var http = require('http');

var dotenv = require('dotenv').config();

var config = require('./config/config');

var functions = require('firebase-functions'); //const Bree = require('bree')


var morgan = require('morgan');

var db = require('./config/database');

var cors = require('cors'); //const http = require('http').Server(app)


var _require = require('./middlewares/language'),
    verifyLanguage = _require.verifyLanguage;

var server = http.createServer(app);

var io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

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
io.on('connection', function (socket) {
  console.log('Connected Successfully!');
  socket.emit('me', socket.id);
  socket.on('disconnect', function () {
    socket.broadcast.emit('callEnded');
  });
  socket.on('rooms:join', function (data) {
    socket.join(data.appointmentId);
  });
  socket.on('calling', function (data) {
    socket.to(data.appointmentId).emit('calling', data);
  });
  socket.on('signal', function (data) {
    socket.to(data.appointmentId).emit('signal', {
      signal: data.signalData,
      callerName: data.callerName
    });
  });
  socket.on('answerCall', function (data) {
    socket.to(data.appointmentId).emit('callAccepted', data.signal);
  });
});
server.listen(config.PORT, function () {
  return console.log("server started on port ".concat(config.PORT, " [RA'AYA APP]"));
});
exports.app = functions.https.onRequest(app);