"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var AppointmentModel = require('../models/AppointmentModel');

var OpeningTimeModel = require('../models/OpeningTimeModel');

var CounterModel = require('../models/CounterModel');

var UserModel = require('../models/UserModel');

var ServiceModel = require('../models/ServiceModel');

var appointmentValidation = require('../validations/appointments');

var utils = require('../utils/utils');

var whatsappCancelAppointment = require('../APIs/whatsapp/send-cancel-appointment');

var _require = require('date-fns'),
    format = _require.format;

var translations = require('../i18n/index');

var mongoose = require('mongoose');

var config = require('../config/config');

var _require2 = require('../APIs/100ms/request'),
    videoPlatformRequest = _require2.videoPlatformRequest;

var email = require('../mails/send-email');

var addAppointment = function addAppointment(request, response) {
  var dataValidation, _request$body, seekerId, expertId, serviceId, startTime, duration, todayDate, expertListPromise, seekerListPromise, servicePromise, _ref, _ref2, expertList, seekerList, service, expert, seeker, endTime, weekDay, startingHour, startingMinute, openingTimes, existingAppointmentsQuery, existingAppointments, roomData, newRoom, counter, appointmentData, appointmentObj, newAppointment, updatedUser, options, appointmentStartTime, appointmentEndTime, newUserEmailData, emailSent;

  return regeneratorRuntime.async(function addAppointment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = appointmentValidation.addAppointment(request.body);

          if (dataValidation.isAccepted) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, seekerId = _request$body.seekerId, expertId = _request$body.expertId, serviceId = _request$body.serviceId, startTime = _request$body.startTime, duration = _request$body.duration;
          todayDate = new Date();

          if (!(todayDate > new Date(startTime))) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Start time has passed',
            field: 'startTime'
          }));

        case 8:
          expertListPromise = UserModel.find({
            _id: expertId,
            type: 'EXPERT'
          });
          seekerListPromise = UserModel.find({
            _id: seekerId
          });
          servicePromise = ServiceModel.findById(serviceId);
          _context.next = 13;
          return regeneratorRuntime.awrap(Promise.all([expertListPromise, seekerListPromise, servicePromise]));

        case 13:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 3);
          expertList = _ref2[0];
          seekerList = _ref2[1];
          service = _ref2[2];

          if (!(expertList.length == 0)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert Id is not registered',
            field: 'expertId'
          }));

        case 20:
          if (!(seekerList.length == 0)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker Id is not registered',
            field: 'seekerId'
          }));

        case 22:
          if (service) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Service ID is not registered',
            field: 'serviceId'
          }));

        case 24:
          if (!(duration > 60)) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Duration limit is 60 minutes',
            field: 'duration'
          }));

        case 26:
          expert = expertList[0];
          seeker = seekerList[0];
          startTime = new Date(startTime);
          endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + duration);
          request.body.endTime = endTime;
          weekDay = config.WEEK_DAYS[startTime.getDay()];
          startingHour = startTime.getHours();
          startingMinute = startTime.getMinutes();
          _context.next = 37;
          return regeneratorRuntime.awrap(OpeningTimeModel.find({
            expertId: expertId,
            weekday: weekDay,
            isActive: true
          }));

        case 37:
          openingTimes = _context.sent;

          if (!(openingTimes.length == 0)) {
            _context.next = 40;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'This day is not available in the schedule',
            field: 'startTime'
          }));

        case 40:
          /*const openingTime = openingTimes[0]
            const combinedAvailableOpeningTime = (openingTime.openingTime.hour * 60) + openingTime.openingTime.minute
          const combinedAvailableClosingTime = (openingTime.closingTime.hour * 60) + openingTime.closingTime.minute
          const combinedTargetTime = (startingHour * 60) + startingMinute
          
          if(combinedAvailableOpeningTime > combinedTargetTime || combinedAvailableClosingTime < combinedTargetTime) {
              return response.status(400).json({
                  accepted: false,
                  message: 'This time slot is not available',
                  field: 'startTime'
              })
          }*/
          existingAppointmentsQuery = {
            expertId: expertId,
            isPaid: true,
            status: {
              $ne: 'CANCELLED'
            },
            $or: [{
              startTime: {
                $lt: endTime
              },
              endTime: {
                $gt: startTime
              }
            }, {
              startTime: {
                $gte: startTime,
                $lt: endTime
              }
            }, {
              endTime: {
                $gt: startTime,
                $lte: endTime
              }
            }]
          };
          _context.next = 43;
          return regeneratorRuntime.awrap(AppointmentModel.find(existingAppointmentsQuery));

        case 43:
          existingAppointments = _context.sent;

          if (!(existingAppointments.length != 0)) {
            _context.next = 46;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'There is appointment reserved at that time',
            field: 'startTime'
          }));

        case 46:
          roomData = {
            template_id: config.VIDEO_PLATFORM.TEMPLATE_ID,
            description: "".concat(duration, " minutes session with ").concat(expert.firstName),
            max_duration_seconds: (duration + 5) * 60
          };
          _context.next = 49;
          return regeneratorRuntime.awrap(videoPlatformRequest.post('/v2/rooms', roomData));

        case 49:
          newRoom = _context.sent;
          _context.next = 52;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'Appointment'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 52:
          counter = _context.sent;
          appointmentData = _objectSpread({
            appointmentId: counter.value,
            roomId: newRoom.data.id
          }, request.body);
          appointmentObj = new AppointmentModel(appointmentData);
          _context.next = 57;
          return regeneratorRuntime.awrap(appointmentObj.save());

        case 57:
          newAppointment = _context.sent;
          _context.next = 60;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(expert._id, {
            totalAppointments: expert.totalAppointments + 1
          }, {
            "new": true
          }));

        case 60:
          updatedUser = _context.sent;
          options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
          };
          appointmentStartTime = new Date(newAppointment.startTime);
          appointmentEndTime = new Date(newAppointment.endTime);
          newUserEmailData = {
            receiverEmail: config.NOTIFICATION_EMAIL,
            subject: 'New Appointment',
            mailBodyText: "You have a new appointment with ID #".concat(newAppointment.appointmentId),
            mailBodyHTML: "\n            <strong>ID: </strong><span>#".concat(newAppointment.appointmentId, "</span><br />\n            <strong>Expert: </strong><span>").concat(expert.firstName, "</span><br />\n            <strong>Seeker: </strong><span>").concat(seeker.firstName, "</span><br />\n            <strong>Price: </strong><span>").concat(newAppointment.price, " EGP</span><br />\n            <strong>Duration: </strong><span>").concat(newAppointment.duration, " minutes</span><br />\n            <strong>Date: </strong><span>").concat(format(newAppointment.startTime, 'dd MMM yyyy'), "</span><br />\n            <strong>Start Time: </strong><span>").concat(appointmentStartTime.toLocaleString('en-US', options), "</span><br />\n            <strong>End Time: </strong><span>").concat(appointmentEndTime.toLocaleString('en-US', options), "</span><br />\n            ")
          };
          _context.next = 67;
          return regeneratorRuntime.awrap(email.sendEmail(newUserEmailData));

        case 67:
          emailSent = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Appointment is booked successfully!',
            appointment: newAppointment,
            expert: updatedUser,
            emailSent: emailSent
          }));

        case 71:
          _context.prev = 71;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 75:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 71]]);
};

var getPaidAppointmentsByExpertIdAndStatus = function getPaidAppointmentsByExpertIdAndStatus(request, response) {
  var _request$params, userId, status, matchQuery, appointments;

  return regeneratorRuntime.async(function getPaidAppointmentsByExpertIdAndStatus$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _request$params = request.params, userId = _request$params.userId, status = _request$params.status;
          matchQuery = {
            expertId: mongoose.Types.ObjectId(userId),
            isPaid: true
          };

          if (status === 'UPCOMING') {
            matchQuery.startTime = {
              $gte: new Date()
            };
          }

          if (status === 'PREVIOUS') {
            matchQuery.startTime = {
              $lt: new Date()
            };
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              startTime: 1
            }
          }, {
            $limit: 25
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
          }, {
            $project: {
              'expert.password': 0,
              'seeker.password': 0
            }
          }]));

        case 7:
          appointments = _context2.sent;
          appointments.forEach(function (appointment) {
            appointment.expert = appointment.expert[0];
            appointment.seeker = appointment.seeker[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getPaidAppointmentsBySeekerIdAndStatus = function getPaidAppointmentsBySeekerIdAndStatus(request, response) {
  var _request$params2, userId, status, matchQuery, appointments;

  return regeneratorRuntime.async(function getPaidAppointmentsBySeekerIdAndStatus$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _request$params2 = request.params, userId = _request$params2.userId, status = _request$params2.status;
          matchQuery = {
            seekerId: mongoose.Types.ObjectId(userId),
            isPaid: true
          };

          if (status === 'UPCOMING') {
            matchQuery.startTime = {
              $gte: new Date()
            };
          }

          if (status === 'PREVIOUS') {
            matchQuery.startTime = {
              $lt: new Date()
            };
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              startTime: 1
            }
          }, {
            $limit: 25
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
          }, {
            $project: {
              'expert.password': 0,
              'seeker.password': 0
            }
          }]));

        case 7:
          appointments = _context3.sent;
          appointments.forEach(function (appointment) {
            appointment.expert = appointment.expert[0];
            appointment.seeker = appointment.seeker[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var updateAppointmentStatus = function updateAppointmentStatus(request, response) {
  var appointmentId, status, dataValidation, appointment, todayDate, updatedAppointment, notificationMessage, expert, seeker, targetPhone, reservationDateTime, messageBody, messageSent;
  return regeneratorRuntime.async(function updateAppointmentStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          appointmentId = request.params.appointmentId;
          status = request.body.status;
          dataValidation = appointmentValidation.updateAppointmentStatus(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context4.next = 8;
          return regeneratorRuntime.awrap(AppointmentModel.findById(appointmentId));

        case 8:
          appointment = _context4.sent;

          if (!(appointment.status == status)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment is already in this state',
            field: 'status'
          }));

        case 11:
          todayDate = new Date();

          if (!(appointment.startTime < todayDate)) {
            _context4.next = 14;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment date has passed',
            field: 'startTime'
          }));

        case 14:
          _context4.next = 16;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndUpdate(appointmentId, {
            status: status
          }, {
            "new": true
          }));

        case 16:
          updatedAppointment = _context4.sent;

          if (!(status == 'CANCELLED')) {
            _context4.next = 31;
            break;
          }

          _context4.next = 20;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(appointment.expertId, {
            $inc: {
              totalAppointments: -1
            }
          }, {
            "new": true
          }));

        case 20:
          expert = _context4.sent;
          _context4.next = 23;
          return regeneratorRuntime.awrap(UserModel.findById(appointment.seekerId));

        case 23:
          seeker = _context4.sent;
          targetPhone = "".concat(expert.countryCode).concat(expert.phone);
          reservationDateTime = new Date(appointment.startTime);
          messageBody = {
            expertName: expert.firstName,
            appointmentId: "#".concat(appointment.appointmentId),
            appointmentDate: format(reservationDateTime, 'dd MMMM yyyy'),
            appointmentTime: format(reservationDateTime, 'hh:mm a'),
            seekerName: seeker.firstName
          };
          _context4.next = 29;
          return regeneratorRuntime.awrap(whatsappCancelAppointment.sendCancelAppointment(targetPhone, 'en', messageBody));

        case 29:
          messageSent = _context4.sent;
          notificationMessage = messageSent.isSent ? 'Message is sent successfully!' : 'There was a problem sending your message';

        case 31:
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated appointment status successfully!',
            appointment: updatedAppointment,
            notificationMessage: notificationMessage
          }));

        case 34:
          _context4.prev = 34;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 38:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var deleteAppointment = function deleteAppointment(request, response) {
  var lang, appointmentId, deletedAppointment;
  return regeneratorRuntime.async(function deleteAppointment$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          lang = request.query.lang;
          appointmentId = request.params.appointmentId;
          _context5.next = 5;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndDelete(appointmentId));

        case 5:
          deletedAppointment = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted appointment successfully!'],
            appointment: deletedAppointment
          }));

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var sendAppointmentReminder = function sendAppointmentReminder(request, response) {
  var mailData, emailSent;
  return regeneratorRuntime.async(function sendAppointmentReminder$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          mailData = {
            receiverEmail: 'omarredaelsayedmohamed@gmail.com',
            subject: 'New User Sign Up',
            mailBodyText: 'You have a new user with ID #123',
            mailBodyHTML: "\n            <strong>ID: </strong><span>#123</span><br />\n            <strong>Name: </strong><span>Omar Reda</span><br />\n            <strong>Email: </strong><span>omar@gmail.com</span><br />\n            <strong>Phone: </strong><span>+201065630331</span><br />\n            <strong>Gender: </strong><span>Male</span><br />\n            <strong>Age: </strong><span>20</span><br />\n            "
          };
          _context6.next = 4;
          return regeneratorRuntime.awrap(email.sendEmail(mailData));

        case 4:
          emailSent = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message sent successfully!',
            emailSent: emailSent
          }));

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getAppointment = function getAppointment(request, response) {
  var appointmentId, appointmentList, appointment;
  return regeneratorRuntime.async(function getAppointment$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          appointmentId = request.params.appointmentId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(appointmentId)
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
          }, {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          }, {
            $project: {
              'expert.password': 0,
              'seeker.password': 0
            }
          }]));

        case 4:
          appointmentList = _context7.sent;
          appointmentList.forEach(function (appointment) {
            appointment.expert = appointment.expert[0];
            appointment.seeker = appointment.seeker[0];
            appointment.service = appointment.service[0];
          });
          appointment = appointmentList[0];
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            appointment: appointment
          }));

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getAppointments = function getAppointments(request, response) {
  var status, _utils$statsQueryGene, searchQuery, matchQuery, appointments, totalAppointments;

  return regeneratorRuntime.async(function getAppointments$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          status = request.query.status;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query, 'startTime'), searchQuery = _utils$statsQueryGene.searchQuery;
          matchQuery = _objectSpread({}, searchQuery);

          if (status == 'PAID') {
            matchQuery.isPaid = true;
          } else if (status == 'UNPAID') {
            matchQuery.isPaid = false;
          }

          _context8.next = 7;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: matchQuery
          }, {
            $sort: {
              startTime: -1
            }
          }, {
            $limit: 25
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
          }, {
            $project: {
              'expert.password': 0,
              'seeker.password': 0
            }
          }]));

        case 7:
          appointments = _context8.sent;
          appointments.forEach(function (appointment) {
            appointment.expert = appointment.expert[0];
            appointment.seeker = appointment.seeker[0];
          });
          _context8.next = 11;
          return regeneratorRuntime.awrap(AppointmentModel.countDocuments(matchQuery));

        case 11:
          totalAppointments = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            totalAppointments: totalAppointments,
            appointments: appointments
          }));

        case 15:
          _context8.prev = 15;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 19:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var get100msRooms = function get100msRooms(request, response) {
  var roomsResponse;
  return regeneratorRuntime.async(function get100msRooms$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(videoPlatformRequest.get('/v2/rooms'));

        case 3:
          roomsResponse = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            rooms: roomsResponse.data.data
          }));

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  addAppointment: addAppointment,
  updateAppointmentStatus: updateAppointmentStatus,
  deleteAppointment: deleteAppointment,
  sendAppointmentReminder: sendAppointmentReminder,
  getAppointment: getAppointment,
  getAppointments: getAppointments,
  getPaidAppointmentsByExpertIdAndStatus: getPaidAppointmentsByExpertIdAndStatus,
  getPaidAppointmentsBySeekerIdAndStatus: getPaidAppointmentsBySeekerIdAndStatus,
  get100msRooms: get100msRooms
};