"use strict";

var https = require('https');

var username = '563874d6-2da6-4a3a-8a19-5b744bc0b310';
var password = 'Reda$afaa77';
var sender = '5479536538';
var message = 'Hello, Omar its the Health Card App';
var recipients = ['201065630331'];
var data = JSON.stringify({
  username: username,
  password: password,
  sender: sender,
  message: message,
  numbers: recipients.join(',')
});
var options = {
  hostname: 'smsmisr.com',
  port: 443,
  path: '/api/send.aspx',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};
var req = https.request(options, function (res) {
  console.log("statusCode: ".concat(res.statusCode));
  res.on('data', function (d) {
    process.stdout.write(d);
  });
});
req.on('error', function (error) {
  console.error(error);
});
req.write(data);
req.end();