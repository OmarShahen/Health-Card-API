"use strict";

var dotenv = require('dotenv').config();

var functions = require('firebase-functions');

var db = require('./config/database');

var AppointmentModel = require('./models/AppointmentModel');

var emails = require('./mails/send-email');

var mailTemplates = require('./mails/templates/reminder');

db().then(function (data) {
  return console.log('Mongo is up and running... ;)');
})["catch"](function (error) {
  return console.error(error);
});

var sendReminders = function sendReminders() {
  var today, startOfDay, endOfDay, appointments, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, appointment, dateOptions, appointmentStartTime, expertTemplateData, expertMailData, seekerTemplateData, seekerMailData;

  return regeneratorRuntime.async(function sendReminders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          today = new Date();
          startOfDay = new Date();
          endOfDay = new Date(today.setDate(today.getDate() + 1));
          _context.next = 5;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: {
              isPaid: true,
              status: {
                $ne: 'CANCELLED'
              },
              isReminderSent: false,
              startTime: {
                $gte: startOfDay,
                $lt: endOfDay
              }
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'expertId',
              foreignField: '_id',
              as: 'expert'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'seekerId',
              foreignField: '_id',
              as: 'seeker'
            }
          }]));

        case 5:
          appointments = _context.sent;
          _context.prev = 6;
          console.log('Sending email reminders...');
          appointments.forEach(function (appointment) {
            appointment.seeker = appointment.seeker[0];
            appointment.expert = appointment.expert[0];
          });
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 12;
          _iterator = appointments[Symbol.iterator]();

        case 14:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 33;
            break;
          }

          appointment = _step.value;
          dateOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
          };
          appointmentStartTime = appointment.startTime.toLocaleString('en-US', dateOptions);
          expertTemplateData = {
            receiverName: appointment.expert.firstName,
            senderName: "RA'AYA",
            startTime: appointmentStartTime
          };
          expertMailData = {
            receiverEmail: appointment.expert.email,
            subject: 'Reminder: Upcoming Appointment',
            mailBodyHTML: mailTemplates.reminderTemplate(expertTemplateData)
          };
          console.log("Sending expert email to ".concat(appointment.expert.email));
          _context.next = 23;
          return regeneratorRuntime.awrap(emails.sendEmail(expertMailData));

        case 23:
          seekerTemplateData = {
            receiverName: appointment.seeker.firstName,
            senderName: "RA'AYA",
            startTime: appointmentStartTime
          };
          seekerMailData = {
            receiverEmail: appointment.seeker.email,
            subject: 'Reminder: Upcoming Appointment',
            mailBodyHTML: mailTemplates.reminderTemplate(seekerTemplateData)
          };
          console.log("Sending seeker email to ".concat(appointment.seeker.email));
          _context.next = 28;
          return regeneratorRuntime.awrap(emails.sendEmail(seekerMailData));

        case 28:
          _context.next = 30;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndUpdate(appointment._id, {
            isReminderSent: true
          }));

        case 30:
          _iteratorNormalCompletion = true;
          _context.next = 14;
          break;

        case 33:
          _context.next = 39;
          break;

        case 35:
          _context.prev = 35;
          _context.t0 = _context["catch"](12);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 39:
          _context.prev = 39;
          _context.prev = 40;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 42:
          _context.prev = 42;

          if (!_didIteratorError) {
            _context.next = 45;
            break;
          }

          throw _iteratorError;

        case 45:
          return _context.finish(42);

        case 46:
          return _context.finish(39);

        case 47:
          _context.next = 51;
          break;

        case 49:
          _context.prev = 49;
          _context.t1 = _context["catch"](6);

        case 51:
          console.log('Finished Sending Reminders');

        case 52:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 49], [12, 35, 39, 47], [40,, 42, 46]]);
};

exports.sendReminder = functions.pubsub.schedule('* * * * *').onRun(function _callee(context) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(sendReminders());

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});