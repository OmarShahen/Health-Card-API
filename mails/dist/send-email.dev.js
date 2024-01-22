"use strict";

var config = require('../config/config');

var _require = require('./config/config'),
    transporter = _require.transporter;

var sendEmail = function sendEmail(mailData) {
  var receiverEmail, subject, mailBodyText, mailBodyHTML, mailOptions;
  return regeneratorRuntime.async(function sendEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          receiverEmail = mailData.receiverEmail, subject = mailData.subject, mailBodyText = mailData.mailBodyText, mailBodyHTML = mailData.mailBodyHTML;
          mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: subject,
            text: mailBodyText,
            html: mailBodyHTML
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          return _context.abrupt("return", {
            isSent: true
          });

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", {
            isSent: false
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  sendEmail: sendEmail
};