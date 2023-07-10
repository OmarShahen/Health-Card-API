"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicPatientModel = require('../models/ClinicPatientModel');

var clinicPatientValidation = require('../validations/clinics-patients-doctors');

var PatientModel = require('../models/PatientModel');

var ClinicModel = require('../models/ClinicModel');

var UserModel = require('../models/UserModel');

var ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel');

var CardModel = require('../models/CardModel');

var getClinicsPatientsDoctors = function getClinicsPatientsDoctors(request, response) {
  var clinicsPatientsDoctors;
  return regeneratorRuntime.async(function getClinicsPatientsDoctors$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find());

        case 3:
          clinicsPatientsDoctors = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsPatientsDoctors: clinicsPatientsDoctors
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var addClinicPatientDoctor = function addClinicPatientDoctor(request, response) {
  var dataValidation, _request$body, patientId, clinicId, doctorId, patientPromise, clinicPromise, doctorPromise, _ref, _ref2, patient, clinic, doctor, registeredClinicPatientDoctorList, registeredClinicPatientList, newClinicPatient, clinicPatientData, clinicPatientObj, clinicPatienDoctortData, clinicPatientDoctorObj, newClinicPatientDoctor;

  return regeneratorRuntime.async(function addClinicPatientDoctor$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = clinicPatientValidation.addClinicPatientDoctor(request.body);

          if (dataValidation.isAccepted) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, patientId = _request$body.patientId, clinicId = _request$body.clinicId, doctorId = _request$body.doctorId;
          patientPromise = PatientModel.findById(patientId);
          clinicPromise = ClinicModel.findById(clinicId);
          doctorPromise = UserModel.findById(doctorId);
          _context2.next = 10;
          return regeneratorRuntime.awrap(Promise.all([patientPromise, clinicPromise, doctorPromise]));

        case 10:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 3);
          patient = _ref2[0];
          clinic = _ref2[1];
          doctor = _ref2[2];

          if (patient) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'patient Id does not exists',
            field: 'patientId'
          }));

        case 17:
          if (clinic) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 19:
          if (doctor) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor Id does not exists',
            field: 'doctorId'
          }));

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find({
            patientId: patientId,
            clinicId: clinicId,
            doctorId: doctorId
          }));

        case 23:
          registeredClinicPatientDoctorList = _context2.sent;

          if (!(registeredClinicPatientDoctorList.length != 0)) {
            _context2.next = 26;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'patient already registered with doctor in the clinic',
            field: 'doctorId'
          }));

        case 26:
          _context2.next = 28;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            patientId: patientId,
            clinicId: clinicId
          }));

        case 28:
          registeredClinicPatientList = _context2.sent;

          if (!(registeredClinicPatientList.length == 0)) {
            _context2.next = 35;
            break;
          }

          clinicPatientData = {
            patientId: patientId,
            clinicId: clinicId
          };
          clinicPatientObj = new ClinicPatientModel(clinicPatientData);
          _context2.next = 34;
          return regeneratorRuntime.awrap(clinicPatientObj.save());

        case 34:
          newClinicPatient = _context2.sent;

        case 35:
          clinicPatienDoctortData = {
            patientId: patientId,
            clinicId: clinicId,
            doctorId: doctorId
          };
          clinicPatientDoctorObj = new ClinicPatientDoctorModel(clinicPatienDoctortData);
          _context2.next = 39;
          return regeneratorRuntime.awrap(clinicPatientDoctorObj.save());

        case 39:
          newClinicPatientDoctor = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'registered patient with doctor in clinic successfully!',
            clinicPatientDoctor: newClinicPatientDoctor,
            clinicPatient: newClinicPatient
          }));

        case 43:
          _context2.prev = 43;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 47:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 43]]);
};

var addClinicPatientDoctorByCardId = function addClinicPatientDoctorByCardId(request, response) {
  var dataValidation, _request$body2, cardId, cvc, clinicId, doctorId, cardList, card, patientListPromise, clinicPromise, doctorPromise, _ref3, _ref4, patientList, clinic, doctor, patient, patientId, registeredClinicPatientDoctorList, registeredClinicPatientList, newClinicPatient, clinicPatientData, clinicPatientObj, clinicPatienDoctortData, clinicPatientDoctorObj, newClinicPatientDoctor;

  return regeneratorRuntime.async(function addClinicPatientDoctorByCardId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = clinicPatientValidation.addClinicPatientDoctorByCardId(request.body);

          if (dataValidation.isAccepted) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body2 = request.body, cardId = _request$body2.cardId, cvc = _request$body2.cvc, clinicId = _request$body2.clinicId, doctorId = _request$body2.doctorId;
          _context3.next = 7;
          return regeneratorRuntime.awrap(CardModel.find({
            cardId: cardId,
            cvc: cvc
          }));

        case 7:
          cardList = _context3.sent;

          if (!(cardList.length == 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid card credentials',
            field: 'cardId'
          }));

        case 10:
          card = cardList[0];

          if (card.isActive) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'card is deactivated',
            field: 'cardId'
          }));

        case 13:
          patientListPromise = PatientModel.find({
            cardId: cardId
          });
          clinicPromise = ClinicModel.findById(clinicId);
          doctorPromise = UserModel.findById(doctorId);
          _context3.next = 18;
          return regeneratorRuntime.awrap(Promise.all([patientListPromise, clinicPromise, doctorPromise]));

        case 18:
          _ref3 = _context3.sent;
          _ref4 = _slicedToArray(_ref3, 3);
          patientList = _ref4[0];
          clinic = _ref4[1];
          doctor = _ref4[2];

          if (!(patientList.length == 0)) {
            _context3.next = 25;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'no patient is registered with the card',
            field: 'patientId'
          }));

        case 25:
          if (clinic) {
            _context3.next = 27;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 27:
          if (doctor) {
            _context3.next = 29;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'doctor Id does not exists',
            field: 'doctorId'
          }));

        case 29:
          patient = patientList[0];
          patientId = patient._id;
          _context3.next = 33;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find({
            patientId: patientId,
            clinicId: clinicId,
            doctorId: doctorId
          }));

        case 33:
          registeredClinicPatientDoctorList = _context3.sent;

          if (!(registeredClinicPatientDoctorList.length != 0)) {
            _context3.next = 36;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'patient already registered with doctor in the clinic',
            field: 'doctorId'
          }));

        case 36:
          _context3.next = 38;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            patientId: patientId,
            clinicId: clinicId
          }));

        case 38:
          registeredClinicPatientList = _context3.sent;

          if (!(registeredClinicPatientList.length == 0)) {
            _context3.next = 45;
            break;
          }

          clinicPatientData = {
            patientId: patientId,
            clinicId: clinicId
          };
          clinicPatientObj = new ClinicPatientModel(clinicPatientData);
          _context3.next = 44;
          return regeneratorRuntime.awrap(clinicPatientObj.save());

        case 44:
          newClinicPatient = _context3.sent;

        case 45:
          clinicPatienDoctortData = {
            patientId: patientId,
            clinicId: clinicId,
            doctorId: doctorId
          };
          clinicPatientDoctorObj = new ClinicPatientDoctorModel(clinicPatienDoctortData);
          _context3.next = 49;
          return regeneratorRuntime.awrap(clinicPatientDoctorObj.save());

        case 49:
          newClinicPatientDoctor = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'registered patient with doctor in clinic successfully!',
            clinicPatientDoctor: newClinicPatientDoctor,
            clinicPatient: newClinicPatient
          }));

        case 53:
          _context3.prev = 53;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 57:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 53]]);
};

var deleteClinicPatientDoctor = function deleteClinicPatientDoctor(request, response) {
  var clinicPatientDoctorId, deletedClinicPatientDoctor;
  return regeneratorRuntime.async(function deleteClinicPatientDoctor$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          clinicPatientDoctorId = request.params.clinicPatientDoctorId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.findByIdAndDelete(clinicPatientDoctorId));

        case 4:
          deletedClinicPatientDoctor = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'deleted clinic patient doctor access successfully!',
            clinicPatientDoctor: deletedClinicPatientDoctor
          }));

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  getClinicsPatientsDoctors: getClinicsPatientsDoctors,
  addClinicPatientDoctor: addClinicPatientDoctor,
  addClinicPatientDoctorByCardId: addClinicPatientDoctorByCardId,
  deleteClinicPatientDoctor: deleteClinicPatientDoctor
};