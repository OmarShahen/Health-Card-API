"use strict";

var functions = require('firebase-functions');

exports.sendAppointmentReminders = functions.pubsub.schedule('every 1 minutes').onRun(function _callee(context) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('The function is working');

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});