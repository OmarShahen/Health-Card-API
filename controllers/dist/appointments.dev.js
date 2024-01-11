"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

var appointmentValidation = require('../validations/appointments');

var ClinicSubscriptionModel = require('../models/followup-service/ClinicSubscriptionModel');

var utils = require('../utils/utils');

var whatsappClinicAppointment = require('../APIs/whatsapp/send-clinic-appointment');

var whatsappCancelAppointment = require('../APIs/whatsapp/send-cancel-appointment');

var _require = require('date-fns'),
    format = _require.format;

var translations = require('../i18n/index');

var mongoose = require('mongoose');

var config = require('../config/config');

var addAppointment = function addAppointment(request, response) {
  var dataValidation, _request$body, seekerId, expertId, startTime, duration, todayDate, expertListPromise, seekerListPromise, _ref, _ref2, expertList, seekerList, expert, seeker, endTime, weekDay, startingHour, startingMinute, openingTimes, existingAppointmentsQuery, existingAppointments, counter, appointmentData, appointmentObj, newAppointment, updatedUser;

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
          _request$body = request.body, seekerId = _request$body.seekerId, expertId = _request$body.expertId, startTime = _request$body.startTime, duration = _request$body.duration;
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
          _context.next = 12;
          return regeneratorRuntime.awrap(Promise.all([expertListPromise, seekerListPromise]));

        case 12:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          expertList = _ref2[0];
          seekerList = _ref2[1];

          if (!(expertList.length == 0)) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Expert Id is not registered',
            field: 'expertId'
          }));

        case 18:
          if (!(seekerList.length == 0)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Seeker Id is not registered',
            field: 'seekerId'
          }));

        case 20:
          if (!(duration > 60)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Duration limit is 60 minutes',
            field: 'duration'
          }));

        case 22:
          expert = expertList[0];
          seeker = seekerList[0];
          startTime = new Date(startTime);
          endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + duration);
          request.body.endTime = endTime;
          weekDay = config.WEEK_DAYS[startTime.getDay()];
          startingHour = startTime.getHours();
          startingMinute = startTime.getMinutes();
          _context.next = 33;
          return regeneratorRuntime.awrap(OpeningTimeModel.find({
            expertId: expertId,
            weekday: weekDay,
            isActive: true,
            'openingTime.hour': {
              $lte: startingHour
            },
            'openingTime.minute': {
              $lte: startingMinute
            },
            'closingTime.hour': {
              $gte: startingHour
            },
            'closingTime.minute': {
              $gte: startingMinute
            }
          }));

        case 33:
          openingTimes = _context.sent;

          if (!(openingTimes.length == 0)) {
            _context.next = 36;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'This time is not available in the schedule',
            field: 'startTime'
          }));

        case 36:
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
          _context.next = 39;
          return regeneratorRuntime.awrap(AppointmentModel.find(existingAppointmentsQuery));

        case 39:
          existingAppointments = _context.sent;

          if (!(existingAppointments.length != 0)) {
            _context.next = 42;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'There is appointment reserved at that time',
            field: 'startTime'
          }));

        case 42:
          _context.next = 44;
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

        case 44:
          counter = _context.sent;
          appointmentData = _objectSpread({
            appointmentId: counter.value
          }, request.body);
          appointmentObj = new AppointmentModel(appointmentData);
          _context.next = 49;
          return regeneratorRuntime.awrap(appointmentObj.save());

        case 49:
          newAppointment = _context.sent;
          _context.next = 52;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(expert._id, {
            totalAppointments: expert.totalAppointments + 1
          }, {
            "new": true
          }));

        case 52:
          updatedUser = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Appointment is booked successfully!',
            appointment: newAppointment,
            expert: updatedUser
          }));

        case 56:
          _context.prev = 56;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 60:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 56]]);
};

var getAppointmentsByDoctorId = function getAppointmentsByDoctorId(request, response) {
  var userId, _utils$statsQueryGene, searchQuery, appointments;

  return regeneratorRuntime.async(function getAppointmentsByDoctorId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene = utils.statsQueryGenerator('doctorId', userId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene.searchQuery;
          _context2.next = 5;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }, {
            $sort: {
              reservationTime: 1
            }
          }]));

        case 5:
          appointments = _context2.sent;
          appointments.forEach(function (appointment) {
            appointment.patient = appointment.patient[0];
            appointment.doctor = appointment.doctor[0];
            appointment.clinic = appointment.clinic[0];
            appointment.service = appointment.service[0];
            /*const todayDate = new Date()
              if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getAppointmentsByClinicId = function getAppointmentsByClinicId(request, response) {
  var clinicId, _utils$statsQueryGene2, searchQuery, appointments;

  return regeneratorRuntime.async(function getAppointmentsByClinicId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('clinicId', clinicId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context3.next = 5;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }, {
            $sort: {
              reservationTime: 1
            }
          }]));

        case 5:
          appointments = _context3.sent;
          appointments.forEach(function (appointment) {
            appointment.patient = appointment.patient[0];
            appointment.doctor = appointment.doctor[0];
            appointment.clinic = appointment.clinic[0];
            appointment.service = appointment.service[0];
            /*const todayDate = new Date()
              if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getAppointmentsByPatientId = function getAppointmentsByPatientId(request, response) {
  var userId, _utils$statsQueryGene3, searchQuery, appointments;

  return regeneratorRuntime.async(function getAppointmentsByPatientId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('patientId', userId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene3.searchQuery;
          _context4.next = 5;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }]));

        case 5:
          appointments = _context4.sent;
          appointments.forEach(function (appointment) {
            appointment.patient = appointment.patient[0];
            appointment.doctor = appointment.doctor[0];
            appointment.clinic = appointment.clinic[0];
            appointment.service = appointment.service[0];
            /*const todayDate = new Date()
              if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getPaidAppointmentsByExpertIdAndStatus = function getPaidAppointmentsByExpertIdAndStatus(request, response) {
  var _request$params, userId, status, matchQuery, appointments;

  return regeneratorRuntime.async(function getPaidAppointmentsByExpertIdAndStatus$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
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

          _context5.next = 7;
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
          appointments = _context5.sent;
          appointments.forEach(function (appointment) {
            appointment.expert = appointment.expert[0];
            appointment.seeker = appointment.seeker[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getPaidAppointmentsBySeekerIdAndStatus = function getPaidAppointmentsBySeekerIdAndStatus(request, response) {
  var _request$params2, userId, status, matchQuery, appointments;

  return regeneratorRuntime.async(function getPaidAppointmentsBySeekerIdAndStatus$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
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

          _context6.next = 7;
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
          appointments = _context6.sent;
          appointments.forEach(function (appointment) {
            appointment.expert = appointment.expert[0];
            appointment.seeker = appointment.seeker[0];
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getClinicAppointmentsByPatientId = function getClinicAppointmentsByPatientId(request, response) {
  var _request$params3, clinicId, patientId, _utils$statsQueryGene4, searchQuery, appointments;

  return regeneratorRuntime.async(function getClinicAppointmentsByPatientId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _request$params3 = request.params, clinicId = _request$params3.clinicId, patientId = _request$params3.patientId;
          _utils$statsQueryGene4 = utils.statsQueryGenerator('patientId', patientId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene4.searchQuery;
          searchQuery.clinicId = mongoose.Types.ObjectId(clinicId);
          _context7.next = 6;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 6:
          appointments = _context7.sent;
          appointments.forEach(function (appointment) {
            appointment.patient = appointment.patient[0];
            appointment.doctor = appointment.doctor[0];
            appointment.clinic = appointment.clinic[0];
            appointment.service = appointment.service[0];
            /*const todayDate = new Date()
              if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getAppointmentsByClinicIdAndStatus = function getAppointmentsByClinicIdAndStatus(request, response) {
  var _request$params4, clinicId, status, _utils$statsQueryGene5, searchQuery, appointments;

  return regeneratorRuntime.async(function getAppointmentsByClinicIdAndStatus$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _request$params4 = request.params, clinicId = _request$params4.clinicId, status = _request$params4.status;
          _utils$statsQueryGene5 = utils.statsQueryGenerator('clinicId', clinicId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene5.searchQuery;
          searchQuery.status = status;
          _context8.next = 6;
          return regeneratorRuntime.awrap(AppointmentModel.find(searchQuery));

        case 6:
          appointments = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getAppointmentsByDoctorIdAndStatus = function getAppointmentsByDoctorIdAndStatus(request, response) {
  var _request$params5, userId, status, _utils$statsQueryGene6, searchQuery, appointments;

  return regeneratorRuntime.async(function getAppointmentsByDoctorIdAndStatus$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _request$params5 = request.params, userId = _request$params5.userId, status = _request$params5.status;
          _utils$statsQueryGene6 = utils.statsQueryGenerator('doctorId', userId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene6.searchQuery;
          searchQuery.status = status;
          _context9.next = 6;
          return regeneratorRuntime.awrap(AppointmentModel.find(searchQuery));

        case 6:
          appointments = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var updateAppointmentStatus = function updateAppointmentStatus(request, response) {
  var appointmentId, status, dataValidation, appointment, todayDate, updatedAppointment, notificationMessage, expert, seeker, targetPhone, reservationDateTime, messageBody, messageSent;
  return regeneratorRuntime.async(function updateAppointmentStatus$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          appointmentId = request.params.appointmentId;
          status = request.body.status;
          dataValidation = appointmentValidation.updateAppointmentStatus(request.body);

          if (dataValidation.isAccepted) {
            _context10.next = 6;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context10.next = 8;
          return regeneratorRuntime.awrap(AppointmentModel.findById(appointmentId));

        case 8:
          appointment = _context10.sent;

          if (!(appointment.status == status)) {
            _context10.next = 11;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment is already in this state',
            field: 'status'
          }));

        case 11:
          todayDate = new Date();

          if (!(appointment.startTime < todayDate)) {
            _context10.next = 14;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment date has passed',
            field: 'startTime'
          }));

        case 14:
          _context10.next = 16;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndUpdate(appointmentId, {
            status: status
          }, {
            "new": true
          }));

        case 16:
          updatedAppointment = _context10.sent;

          if (!(status == 'CANCELLED')) {
            _context10.next = 31;
            break;
          }

          _context10.next = 20;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(appointment.expertId, {
            $inc: {
              totalAppointments: -1
            }
          }, {
            "new": true
          }));

        case 20:
          expert = _context10.sent;
          _context10.next = 23;
          return regeneratorRuntime.awrap(UserModel.findById(appointment.seekerId));

        case 23:
          seeker = _context10.sent;
          targetPhone = "".concat(expert.countryCode).concat(expert.phone);
          reservationDateTime = new Date(appointment.startTime);
          messageBody = {
            expertName: expert.firstName,
            appointmentId: "#".concat(appointment.appointmentId),
            appointmentDate: format(reservationDateTime, 'dd MMMM yyyy'),
            appointmentTime: format(reservationDateTime, 'hh:mm a'),
            seekerName: seeker.firstName
          };
          _context10.next = 29;
          return regeneratorRuntime.awrap(whatsappCancelAppointment.sendCancelAppointment(targetPhone, 'en', messageBody));

        case 29:
          messageSent = _context10.sent;
          notificationMessage = messageSent.isSent ? 'Message is sent successfully!' : 'There was a problem sending your message';

        case 31:
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated appointment status successfully!',
            appointment: updatedAppointment,
            notificationMessage: notificationMessage
          }));

        case 34:
          _context10.prev = 34;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 38:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var deleteAppointment = function deleteAppointment(request, response) {
  var lang, appointmentId, deletedAppointment;
  return regeneratorRuntime.async(function deleteAppointment$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          lang = request.query.lang;
          appointmentId = request.params.appointmentId;
          _context11.next = 5;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndDelete(appointmentId));

        case 5:
          deletedAppointment = _context11.sent;
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted appointment successfully!'],
            appointment: deletedAppointment
          }));

        case 9:
          _context11.prev = 9;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var sendAppointmentReminder = function sendAppointmentReminder(request, response) {
  var appointmentId, targetPhone, messageBody, messageSent;
  return regeneratorRuntime.async(function sendAppointmentReminder$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          appointmentId = request.params.appointmentId;
          targetPhone = '201065630331';
          messageBody = {
            clinicName: 'الرعاية',
            appointmentId: '123#',
            patientName: 'عمر رضا السيد',
            appointmentDate: '2023-10-10',
            appointmentTime: '10:00 am',
            patientPhone: '201065630331',
            visitReason: 'كشف',
            price: '250 EGP'
          };
          _context12.next = 6;
          return regeneratorRuntime.awrap(whatsappClinicAppointment.sendClinicAppointment(targetPhone, 'ar', messageBody));

        case 6:
          messageSent = _context12.sent;

          if (messageSent.isSent) {
            _context12.next = 9;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['There was a problem sending the message'],
            field: 'appointmentId'
          }));

        case 9:
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Message sent successfully!'
          }));

        case 12:
          _context12.prev = 12;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 16:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getFollowupRegisteredClinicsAppointments = function getFollowupRegisteredClinicsAppointments(request, response) {
  var subscriptionList, clinicsIds, uniqueClinicIdsSet, uniqueClinicIdsList, appointments;
  return regeneratorRuntime.async(function getFollowupRegisteredClinicsAppointments$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.find({
            isActive: true,
            endDate: {
              $gt: Date.now()
            }
          }));

        case 3:
          subscriptionList = _context13.sent;
          clinicsIds = subscriptionList.map(function (subscription) {
            return subscription.clinicId;
          });
          uniqueClinicIdsSet = new Set(clinicsIds);
          uniqueClinicIdsList = _toConsumableArray(uniqueClinicIdsSet);
          _context13.next = 9;
          return regeneratorRuntime.awrap(AppointmentModel.aggregate([{
            $match: {
              clinicId: {
                $in: uniqueClinicIdsList
              }
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'services',
              localField: 'serviceId',
              foreignField: '_id',
              as: 'service'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $project: {
              'doctor.password': 0
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 9:
          appointments = _context13.sent;
          appointments.forEach(function (appointment) {
            appointment.patient = appointment.patient[0];
            appointment.doctor = appointment.doctor[0];
            appointment.clinic = appointment.clinic[0];
            appointment.service = appointment.service[0];
            var todayDate = new Date();

            if (todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
              appointment.status = 'EXPIRED';
            }
          });
          return _context13.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 14:
          _context13.prev = 14;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          return _context13.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'internal server error',
            error: _context13.t0.message
          }));

        case 18:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var getAppointment = function getAppointment(request, response) {
  var appointmentId, appointmentList, appointment;
  return regeneratorRuntime.async(function getAppointment$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          appointmentId = request.params.appointmentId;
          _context14.next = 4;
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
            $project: {
              'expert.password': 0,
              'seeker.password': 0
            }
          }]));

        case 4:
          appointmentList = _context14.sent;
          appointmentList.forEach(function (appointment) {
            appointment.expert = appointment.expert[0];
            appointment.seeker = appointment.seeker[0];
          });
          appointment = appointmentList[0];
          return _context14.abrupt("return", response.status(200).json({
            accepted: true,
            appointment: appointment
          }));

        case 10:
          _context14.prev = 10;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          return _context14.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context14.t0.message
          }));

        case 14:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  addAppointment: addAppointment,
  getAppointmentsByDoctorId: getAppointmentsByDoctorId,
  getAppointmentsByClinicId: getAppointmentsByClinicId,
  getAppointmentsByPatientId: getAppointmentsByPatientId,
  getClinicAppointmentsByPatientId: getClinicAppointmentsByPatientId,
  getAppointmentsByClinicIdAndStatus: getAppointmentsByClinicIdAndStatus,
  getAppointmentsByDoctorIdAndStatus: getAppointmentsByDoctorIdAndStatus,
  updateAppointmentStatus: updateAppointmentStatus,
  deleteAppointment: deleteAppointment,
  sendAppointmentReminder: sendAppointmentReminder,
  getFollowupRegisteredClinicsAppointments: getFollowupRegisteredClinicsAppointments,
  getAppointment: getAppointment,
  getPaidAppointmentsByExpertIdAndStatus: getPaidAppointmentsByExpertIdAndStatus,
  getPaidAppointmentsBySeekerIdAndStatus: getPaidAppointmentsBySeekerIdAndStatus
};