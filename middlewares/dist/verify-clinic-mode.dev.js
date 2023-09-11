"use strict";

var _module$exports;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ClinicModel = require('../models/ClinicModel');

var EncounterModel = require('../models/EncounterModel');

var PrescriptionModel = require('../models/PrescriptionModel');

var InvoiceModel = require('../models/InvoiceModel');

var AppointmentModel = require('../models/AppointmentModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var ClinicPatientDoctorModel = require('../models/ClinicDoctorModel');

var ClinicRequestModel = require('../models/ClinicRequestModel');

var ServiceModel = require('../models/ServiceModel');

var UserModel = require('../models/UserModel');

var FolderModel = require('../models/file-storage/FolderModel');

var utils = require('../utils/utils');

var config = require('../config/config');

var verifyClinicEncounters = function verifyClinicEncounters(request, response, next) {
  var clinicId, clinic, encounters, todayDate;
  return regeneratorRuntime.async(function verifyClinicEncounters$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context.sent;

          if (clinic) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context.next = 15;
            break;
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(EncounterModel.find({
            clinicId: clinicId
          }));

        case 12:
          encounters = _context.sent;

          if (!(encounters.length >= config.TEST_MODE_LIMIT)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in encounters',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context.abrupt("return", next());

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicPrescriptions = function verifyClinicPrescriptions(request, response, next) {
  var clinicId, clinic, prescriptions, todayDate;
  return regeneratorRuntime.async(function verifyClinicPrescriptions$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context2.sent;

          if (clinic) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context2.next = 15;
            break;
          }

          _context2.next = 12;
          return regeneratorRuntime.awrap(PrescriptionModel.find({
            clinicId: clinicId
          }));

        case 12:
          prescriptions = _context2.sent;

          if (!(prescriptions.length >= config.TEST_MODE_LIMIT)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in prescriptions',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context2.abrupt("return", next());

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicInvoices = function verifyClinicInvoices(request, response, next) {
  var clinicId, clinic, invoices, todayDate;
  return regeneratorRuntime.async(function verifyClinicInvoices$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context3.sent;

          if (clinic) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context3.next = 15;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(InvoiceModel.find({
            clinicId: clinicId
          }));

        case 12:
          invoices = _context3.sent;

          if (!(invoices.length >= config.TEST_MODE_LIMIT)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in invoices',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context3.abrupt("return", next());

        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 25:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicAppointments = function verifyClinicAppointments(request, response, next) {
  var clinicId, clinic, appointments, todayDate;
  return regeneratorRuntime.async(function verifyClinicAppointments$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context4.sent;

          if (clinic) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context4.next = 15;
            break;
          }

          _context4.next = 12;
          return regeneratorRuntime.awrap(AppointmentModel.find({
            clinicId: clinicId
          }));

        case 12:
          appointments = _context4.sent;

          if (!(appointments.length >= config.TEST_MODE_LIMIT)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in appointments',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context4.abrupt("return", next());

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicServices = function verifyClinicServices(request, response, next) {
  var clinicId, clinic, services, todayDate;
  return regeneratorRuntime.async(function verifyClinicServices$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context5.sent;

          if (clinic) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(ServiceModel.find({
            clinicId: clinicId
          }));

        case 12:
          services = _context5.sent;

          if (!(services.length >= config.TEST_MODE_LIMIT)) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in clinic services',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context5.next = 18;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context5.abrupt("return", next());

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicPatients = function verifyClinicPatients(request, response, next) {
  var _request$body, clinicId, cardId, clinic, patients, todayDate;

  return regeneratorRuntime.async(function verifyClinicPatients$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _request$body = request.body, clinicId = _request$body.clinicId, cardId = _request$body.cardId;

          if (utils.isObjectId(clinicId)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context6.sent;

          if (clinic) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context6.next = 15;
            break;
          }

          _context6.next = 12;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            clinicId: clinicId
          }));

        case 12:
          patients = _context6.sent;

          if (!(patients.length >= config.TEST_MODE_LIMIT)) {
            _context6.next = 15;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in patients',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context6.next = 18;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context6.abrupt("return", next());

        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 25:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicPatientsDoctors = function verifyClinicPatientsDoctors(request, response, next) {
  var _request$body2, clinicId, doctorId, clinic, doctor, patients, todayDate;

  return regeneratorRuntime.async(function verifyClinicPatientsDoctors$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _request$body2 = request.body, clinicId = _request$body2.clinicId, doctorId = _request$body2.doctorId;

          if (utils.isObjectId(clinicId)) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          if (utils.isObjectId(doctorId)) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor Id does not exist',
            field: 'doctorId'
          }));

        case 6:
          _context7.next = 8;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 8:
          clinic = _context7.sent;
          _context7.next = 11;
          return regeneratorRuntime.awrap(UserModel.findById(doctorId));

        case 11:
          doctor = _context7.sent;

          if (clinic) {
            _context7.next = 14;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 14:
          if (doctor) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor Id does not exist',
            field: 'doctorId'
          }));

        case 16:
          if (!(clinic.mode == 'TEST')) {
            _context7.next = 22;
            break;
          }

          _context7.next = 19;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find({
            clinicId: clinicId,
            doctorId: doctorId
          }));

        case 19:
          patients = _context7.sent;

          if (!(patients.length >= config.TEST_MODE_LIMIT)) {
            _context7.next = 22;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in patients',
            field: 'mode'
          }));

        case 22:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context7.next = 25;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 25:
          return _context7.abrupt("return", next());

        case 28:
          _context7.prev = 28;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 32:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var verifyClinicStaffRequest = function verifyClinicStaffRequest(request, response, next) {
  var clinicId, clinic, clinicRequests, todayDate;
  return regeneratorRuntime.async(function verifyClinicStaffRequest$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context8.sent;

          if (clinic) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context8.next = 15;
            break;
          }

          _context8.next = 12;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            clinicId: clinicId,
            role: 'STAFF'
          }));

        case 12:
          clinicRequests = _context8.sent;

          if (!(clinicRequests.length >= 1)) {
            _context8.next = 15;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in clinic staffs invitations',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context8.next = 18;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context8.abrupt("return", next());

        case 21:
          _context8.prev = 21;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 25:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicAddDoctorRequest = function verifyClinicAddDoctorRequest(request, response, next) {
  var clinicId, clinic, clinicRequests, todayDate;
  return regeneratorRuntime.async(function verifyClinicAddDoctorRequest$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context9.next = 4;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context9.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context9.sent;

          if (clinic) {
            _context9.next = 9;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context9.next = 15;
            break;
          }

          _context9.next = 12;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            clinicId: clinicId,
            role: 'DOCTOR'
          }));

        case 12:
          clinicRequests = _context9.sent;

          if (!(clinicRequests.length >= 1)) {
            _context9.next = 15;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in clinic doctors invitations',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context9.next = 18;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context9.abrupt("return", next());

        case 21:
          _context9.prev = 21;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 25:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicAddOwnerRequest = function verifyClinicAddOwnerRequest(request, response, next) {
  var clinicId, clinic, clinicRequests, todayDate;
  return regeneratorRuntime.async(function verifyClinicAddOwnerRequest$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context10.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context10.sent;

          if (clinic) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context10.next = 15;
            break;
          }

          _context10.next = 12;
          return regeneratorRuntime.awrap(ClinicRequestModel.find({
            clinicId: clinicId,
            role: 'OWNER'
          }));

        case 12:
          clinicRequests = _context10.sent;

          if (!(clinicRequests.length >= 1)) {
            _context10.next = 15;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in clinic owners invitations',
            field: 'mode'
          }));

        case 15:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context10.next = 18;
            break;
          }

          return _context10.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 18:
          return _context10.abrupt("return", next());

        case 21:
          _context10.prev = 21;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 25:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

var verifyClinicFolders = function verifyClinicFolders(request, response, next) {
  var clinicId, clinic, todayDate;
  return regeneratorRuntime.async(function verifyClinicFolders$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          clinicId = request.body.clinicId;

          if (utils.isObjectId(clinicId)) {
            _context11.next = 4;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 4:
          _context11.next = 6;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 6:
          clinic = _context11.sent;

          if (clinic) {
            _context11.next = 9;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exist',
            field: 'clinicId'
          }));

        case 9:
          if (!(clinic.mode == 'TEST')) {
            _context11.next = 11;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in folders',
            field: 'mode'
          }));

        case 11:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context11.next = 14;
            break;
          }

          return _context11.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 14:
          return _context11.abrupt("return", next());

        case 17:
          _context11.prev = 17;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 21:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var verifyClinicFiles = function verifyClinicFiles(request, response, next) {
  var folderId, folder, clinic, todayDate;
  return regeneratorRuntime.async(function verifyClinicFiles$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          folderId = request.body.folderId;

          if (utils.isObjectId(folderId)) {
            _context12.next = 4;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Folder Id does not exist',
            field: 'folderId'
          }));

        case 4:
          _context12.next = 6;
          return regeneratorRuntime.awrap(FolderModel.findById(folderId));

        case 6:
          folder = _context12.sent;

          if (folder) {
            _context12.next = 9;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Folder Id does not exist',
            field: 'folderId'
          }));

        case 9:
          _context12.next = 11;
          return regeneratorRuntime.awrap(ClinicModel.findById(folder.clinicId));

        case 11:
          clinic = _context12.sent;

          if (!(clinic.mode == 'TEST')) {
            _context12.next = 14;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'passed testing mode limit in files',
            field: 'mode'
          }));

        case 14:
          todayDate = new Date();

          if (!(clinic.mode != 'TEST' && (!clinic.activeUntilDate || new Date(clinic.activeUntilDate) < todayDate))) {
            _context12.next = 17;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic is deactivated due to subscription expiration',
            field: 'activeUntilDate'
          }));

        case 17:
          return _context12.abrupt("return", next());

        case 20:
          _context12.prev = 20;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 24:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

module.exports = (_module$exports = {
  verifyClinicEncounters: verifyClinicEncounters,
  verifyClinicPrescriptions: verifyClinicPrescriptions,
  verifyClinicInvoices: verifyClinicInvoices,
  verifyClinicAppointments: verifyClinicAppointments,
  verifyClinicServices: verifyClinicServices,
  verifyClinicPatients: verifyClinicPatients,
  verifyClinicPatientsDoctors: verifyClinicPatientsDoctors,
  verifyClinicStaffRequest: verifyClinicStaffRequest,
  verifyClinicAddDoctorRequest: verifyClinicAddDoctorRequest
}, _defineProperty(_module$exports, "verifyClinicAddDoctorRequest", verifyClinicAddDoctorRequest), _defineProperty(_module$exports, "verifyClinicAddOwnerRequest", verifyClinicAddOwnerRequest), _defineProperty(_module$exports, "verifyClinicFolders", verifyClinicFolders), _defineProperty(_module$exports, "verifyClinicFiles", verifyClinicFiles), _module$exports);