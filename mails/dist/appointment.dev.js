"use strict";

var config = require('../config/config');

var _require = require('./config/config'),
    transporter = _require.transporter;

var sendAppointmentEmail = function sendAppointmentEmail(mailData) {
  var receiverEmail, appointmentData, clinicName, clinicCity, serviceName, appointmentDate, mailOptions, success;
  return regeneratorRuntime.async(function sendAppointmentEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          receiverEmail = mailData.receiverEmail, appointmentData = mailData.appointmentData;
          clinicName = appointmentData.clinicName, clinicCity = appointmentData.clinicCity, serviceName = appointmentData.serviceName, appointmentDate = appointmentData.appointmentDate;
          mailOptions = {
            from: config.EMAIL.APP_MAIL,
            to: receiverEmail,
            subject: 'New Clinic Appointment',
            text: "You have a new appointment in ".concat(clinicName, " in ").concat(clinicCity, " for ").concat(serviceName, " at ").concat(appointmentDate, ".")
          };
          _context.next = 6;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 6:
          success = _context.sent;
          return _context.abrupt("return", {
            isSent: true
          });

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", {
            isSent: false
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  sendAppointmentEmail: sendAppointmentEmail
};