"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var AppointmentModel = require('../models/AppointmentModel');

var UserModel = require('../models/UserModel');

var ServiceModel = require('../models/ServiceModel');

var appointmentValidation = require('../validations/appointments');

var ClinicModel = require('../models/ClinicModel');

var utils = require('../utils/utils');

var _require = require('../mails/appointment'),
    sendAppointmentEmail = _require.sendAppointmentEmail;

var _require2 = require('date-fns'),
    format = _require2.format;

var addAppointment = function addAppointment(request, response) {
  var dataValidation, _request$body, clinicId, doctorId, serviceId, patientName, patientCountryCode, patientPhone, status, reservationTime, isSendMail, todayDate, clinicPromise, serviceListPromise, doctorPromise, _ref, _ref2, clinic, serviceList, doctor, appointment, appointmentData, appointmentObj, newAppointment, mailData, mailStatus;

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
          _request$body = request.body, clinicId = _request$body.clinicId, doctorId = _request$body.doctorId, serviceId = _request$body.serviceId, patientName = _request$body.patientName, patientCountryCode = _request$body.patientCountryCode, patientPhone = _request$body.patientPhone, status = _request$body.status, reservationTime = _request$body.reservationTime, isSendMail = _request$body.isSendMail;
          todayDate = new Date();

          if (!(todayDate > new Date(reservationTime))) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Reservate time has passed',
            field: 'reservationTime'
          }));

        case 8:
          clinicPromise = ClinicModel.findById(clinicId);
          serviceListPromise = ServiceModel.find({
            _id: serviceId,
            clinicId: clinicId
          });
          doctorPromise = UserModel.findById(doctorId);
          _context.next = 13;
          return regeneratorRuntime.awrap(Promise.all([clinicPromise, serviceListPromise, doctorPromise]));

        case 13:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 3);
          clinic = _ref2[0];
          serviceList = _ref2[1];
          doctor = _ref2[2];

          if (clinic) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 20:
          if (!(serviceList.length == 0)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'service Id is not registered',
            field: 'serviceId'
          }));

        case 22:
          if (doctor) {
            _context.next = 24;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor Id is not registered',
            field: 'doctorId'
          }));

        case 24:
          _context.next = 26;
          return regeneratorRuntime.awrap(AppointmentModel.find({
            doctorId: doctorId,
            reservationTime: reservationTime
          }));

        case 26:
          appointment = _context.sent;

          if (!(appointment.length != 0)) {
            _context.next = 29;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor is already registered in that time',
            field: 'reservationTime'
          }));

        case 29:
          appointmentData = {
            clinicId: clinicId,
            doctorId: doctorId,
            serviceId: serviceId,
            patientName: patientName,
            patientCountryCode: patientCountryCode,
            patientPhone: patientPhone,
            status: status,
            reservationTime: reservationTime
          };
          appointmentObj = new AppointmentModel(appointmentData);
          _context.next = 33;
          return regeneratorRuntime.awrap(appointmentObj.save());

        case 33:
          newAppointment = _context.sent;
          mailData = {
            receiverEmail: doctor.email,
            appointmentData: {
              clinicName: clinic.name,
              clinicCity: utils.capitalizeFirstLetter(clinic.city),
              serviceName: serviceList[0].name,
              appointmentDate: format(new Date(newAppointment.reservationTime), 'EEEE, MMMM d, yyyy h:mm a')
            }
          };

          if (!isSendMail) {
            _context.next = 39;
            break;
          }

          _context.next = 38;
          return regeneratorRuntime.awrap(sendAppointmentEmail(mailData));

        case 38:
          mailStatus = _context.sent;

        case 39:
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Registered appointment successfully!',
            appointment: newAppointment,
            mailStatus: mailStatus
          }));

        case 42:
          _context.prev = 42;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 46:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 42]]);
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

        case 5:
          appointments = _context2.sent;
          appointments.forEach(function (appointment) {
            appointment.doctor = appointment.doctor[0];
            appointment.clinic = appointment.clinic[0];
            appointment.service = appointment.service[0];
            var todayDate = new Date();

            if (todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
              appointment.status = 'EXPIRED';
            }
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

        case 5:
          appointments = _context3.sent;
          appointments.forEach(function (appointment) {
            appointment.doctor = appointment.doctor[0];
            appointment.clinic = appointment.clinic[0];
            appointment.service = appointment.service[0];
            var todayDate = new Date();

            if (todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
              appointment.status = 'EXPIRED';
            }
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

var getAppointmentsByClinicIdAndStatus = function getAppointmentsByClinicIdAndStatus(request, response) {
  var _request$params, clinicId, status, _utils$statsQueryGene3, searchQuery, appointments;

  return regeneratorRuntime.async(function getAppointmentsByClinicIdAndStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _request$params = request.params, clinicId = _request$params.clinicId, status = _request$params.status;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('clinicId', clinicId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene3.searchQuery;
          searchQuery.status = status;
          _context4.next = 6;
          return regeneratorRuntime.awrap(AppointmentModel.find(searchQuery));

        case 6:
          appointments = _context4.sent;
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

var getAppointmentsByDoctorIdAndStatus = function getAppointmentsByDoctorIdAndStatus(request, response) {
  var _request$params2, userId, status, _utils$statsQueryGene4, searchQuery, appointments;

  return regeneratorRuntime.async(function getAppointmentsByDoctorIdAndStatus$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _request$params2 = request.params, userId = _request$params2.userId, status = _request$params2.status;
          _utils$statsQueryGene4 = utils.statsQueryGenerator('doctorId', userId, request.query, 'reservationTime'), searchQuery = _utils$statsQueryGene4.searchQuery;
          searchQuery.status = status;
          _context5.next = 6;
          return regeneratorRuntime.awrap(AppointmentModel.find(searchQuery));

        case 6:
          appointments = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            appointments: appointments
          }));

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var updateAppointmentStatus = function updateAppointmentStatus(request, response) {
  var appointmentId, status, dataValidation, appointment, todayDate, updatedAppointment;
  return regeneratorRuntime.async(function updateAppointmentStatus$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          appointmentId = request.params.appointmentId;
          status = request.body.status;
          dataValidation = appointmentValidation.updateAppointmentStatus(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context6.next = 8;
          return regeneratorRuntime.awrap(AppointmentModel.findById(appointmentId));

        case 8:
          appointment = _context6.sent;

          if (!(appointment.status == status)) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'appointment is already in this state',
            field: 'status'
          }));

        case 11:
          todayDate = new Date();

          if (!(appointment.reservationTime < todayDate)) {
            _context6.next = 14;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Appointment date has passed',
            field: 'reservationDate'
          }));

        case 14:
          _context6.next = 16;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndUpdate(appointmentId, {
            status: status
          }, {
            "new": true
          }));

        case 16:
          updatedAppointment = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated appointment status successfully!',
            appointment: updatedAppointment
          }));

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 24:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var deleteAppointment = function deleteAppointment(request, response) {
  var appointmentId, deletedAppointment;
  return regeneratorRuntime.async(function deleteAppointment$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          appointmentId = request.params.appointmentId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(AppointmentModel.findByIdAndDelete(appointmentId));

        case 4:
          deletedAppointment = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted appointment successfully',
            appointment: deletedAppointment
          }));

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  addAppointment: addAppointment,
  getAppointmentsByDoctorId: getAppointmentsByDoctorId,
  getAppointmentsByClinicId: getAppointmentsByClinicId,
  getAppointmentsByClinicIdAndStatus: getAppointmentsByClinicIdAndStatus,
  getAppointmentsByDoctorIdAndStatus: getAppointmentsByDoctorIdAndStatus,
  updateAppointmentStatus: updateAppointmentStatus,
  deleteAppointment: deleteAppointment
};