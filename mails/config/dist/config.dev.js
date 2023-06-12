"use strict";

var config = require('../../config/config');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: config.EMAIL.APP_MAIL_SERVICE,
  auth: {
    user: config.EMAIL.APP_MAIL,
    pass: config.EMAIL.APP_MAIL_PASSWORD
  }
});
module.exports = {
  transporter: transporter
};