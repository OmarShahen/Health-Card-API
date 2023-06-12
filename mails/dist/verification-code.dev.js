"use strict";

var config = require('../config/config');

var _require = require('./config/config'),
    transporter = _require.transporter;

var sendVerificationCode = function sendVerificationCode(verificationData) {
  var receiverEmail, verificationCode, mailOptions, success;
  return regeneratorRuntime.async(function sendVerificationCode$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          receiverEmail = verificationData.receiverEmail, verificationCode = verificationData.verificationCode;
          mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: 'Account Email Verification',
            text: "This is your account verification code ".concat(verificationCode)
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          success = _context.sent;
          return _context.abrupt("return", {
            isSent: true
          });

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", {
            isSent: false
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  sendVerificationCode: sendVerificationCode
};