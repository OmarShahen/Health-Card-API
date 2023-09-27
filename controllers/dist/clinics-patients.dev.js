"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicPatientModel = require('../models/ClinicPatientModel');

var clinicPatientValidation = require('../validations/clinics-patients');

var PatientModel = require('../models/PatientModel');

var ClinicModel = require('../models/ClinicModel');

var CardModel = require('../models/CardModel');

var translations = require('../i18n/index');

var getClinicsPatients = function getClinicsPatients(request, response) {
  var clinicsPatients;
  return regeneratorRuntime.async(function getClinicsPatients$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ClinicPatientModel.find());

        case 3:
          clinicsPatients = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsPatients: clinicsPatients
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

var getClinicPatientsByClinicId = function getClinicPatientsByClinicId(request, response) {
  var clinicId, clinicsPatients;
  return regeneratorRuntime.async(function getClinicPatientsByClinicId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          clinicId = request.params.clinicId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            clinicId: clinicId
          }).sort({
            createdAt: -1
          }));

        case 4:
          clinicsPatients = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsPatients: clinicsPatients
          }));

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var addClinicPatient = function addClinicPatient(request, response) {
  var dataValidation, _request$body, patientId, clinicId, patientPromise, clinicPromise, _ref, _ref2, patient, clinic, registeredClinicPatientList, clinicPatientData, clinicPatientObj, newClinicPatient;

  return regeneratorRuntime.async(function addClinicPatient$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = clinicPatientValidation.addClinicPatient(request.body);

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
          _request$body = request.body, patientId = _request$body.patientId, clinicId = _request$body.clinicId;
          patientPromise = PatientModel.findById(patientId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context3.next = 9;
          return regeneratorRuntime.awrap(Promise.all([patientPromise, clinicPromise]));

        case 9:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 2);
          patient = _ref2[0];
          clinic = _ref2[1];

          if (patient) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'patient Id does not exists',
            field: 'patientId'
          }));

        case 15:
          if (clinic) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            patientId: patientId,
            clinicId: clinicId
          }));

        case 19:
          registeredClinicPatientList = _context3.sent;

          if (!(registeredClinicPatientList.length != 0)) {
            _context3.next = 22;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'patient already registered with clinic',
            field: 'clinicId'
          }));

        case 22:
          clinicPatientData = {
            patientId: patientId,
            clinicId: clinicId
          };
          clinicPatientObj = new ClinicPatientModel(clinicPatientData);
          _context3.next = 26;
          return regeneratorRuntime.awrap(clinicPatientObj.save());

        case 26:
          newClinicPatient = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'registered patient to clinic successfully!',
            clinicPatient: newClinicPatient
          }));

        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

var deleteClinicPatient = function deleteClinicPatient(request, response) {
  var lang, clinicPatientId, deletedClinicPatient;
  return regeneratorRuntime.async(function deleteClinicPatient$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          lang = request.query.lang;
          clinicPatientId = request.params.clinicPatientId;
          _context4.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.findByIdAndDelete(clinicPatientId));

        case 5:
          deletedClinicPatient = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic patient access successfully!'],
            clinicPatient: deletedClinicPatient
          }));

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var addClinicPatientByCardId = function addClinicPatientByCardId(request, response) {
  var dataValidation, _request$body2, cardId, cvc, clinicId, cardList, card, patientListPromise, clinicPromise, _ref3, _ref4, patientList, clinic, patient, patientId, registeredClinicPatientList, clinicPatientData, clinicPatientObj, newClinicPatient;

  return regeneratorRuntime.async(function addClinicPatientByCardId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = clinicPatientValidation.addClinicPatientByCardId(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body2 = request.body, cardId = _request$body2.cardId, cvc = _request$body2.cvc, clinicId = _request$body2.clinicId;
          _context5.next = 7;
          return regeneratorRuntime.awrap(CardModel.find({
            cardId: cardId,
            cvc: cvc
          }));

        case 7:
          cardList = _context5.sent;

          if (!(cardList.length == 0)) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Invalid card credentials'],
            field: 'cardId'
          }));

        case 10:
          card = cardList[0];

          if (card.isActive) {
            _context5.next = 13;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Card is deactivated'],
            field: 'cardId'
          }));

        case 13:
          patientListPromise = PatientModel.find({
            cardId: cardId
          });
          clinicPromise = ClinicModel.findById(clinicId);
          _context5.next = 17;
          return regeneratorRuntime.awrap(Promise.all([patientListPromise, clinicPromise]));

        case 17:
          _ref3 = _context5.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          patientList = _ref4[0];
          clinic = _ref4[1];

          if (!(patientList.length == 0)) {
            _context5.next = 23;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['No patient is registered with the card'],
            field: 'cardId'
          }));

        case 23:
          if (clinic) {
            _context5.next = 25;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 25:
          patient = patientList[0];
          patientId = patient._id;
          _context5.next = 29;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            patientId: patientId,
            clinicId: clinicId
          }));

        case 29:
          registeredClinicPatientList = _context5.sent;

          if (!(registeredClinicPatientList.length != 0)) {
            _context5.next = 32;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Patient is already registered with clinic'],
            field: 'clinicId'
          }));

        case 32:
          clinicPatientData = {
            patientId: patientId,
            clinicId: clinicId
          };
          clinicPatientObj = new ClinicPatientModel(clinicPatientData);
          _context5.next = 36;
          return regeneratorRuntime.awrap(clinicPatientObj.save());

        case 36:
          newClinicPatient = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Registered patient to clinic successfully!'],
            clinicPatient: newClinicPatient
          }));

        case 40:
          _context5.prev = 40;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 44:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 40]]);
};

var setClinicPatientSurveyed = function setClinicPatientSurveyed(request, response) {
  var clinicPatientId, isSurveyed, surveyData, updatedPatientClinic;
  return regeneratorRuntime.async(function setClinicPatientSurveyed$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          clinicPatientId = request.params.clinicPatientId;
          isSurveyed = request.body.isSurveyed;

          if (!(typeof isSurveyed != 'boolean')) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Invalid is surveyed format',
            field: 'isSurveyed'
          }));

        case 5:
          surveyData = {
            survey: {
              isDone: isSurveyed,
              doneById: null,
              doneDate: null
            }
          };

          if (isSurveyed) {
            surveyData = {
              survey: {
                isDone: isSurveyed,
                doneById: request.user._id,
                doneDate: new Date()
              }
            };
          }

          _context6.next = 9;
          return regeneratorRuntime.awrap(ClinicPatientModel.findByIdAndUpdate(clinicPatientId, surveyData, {
            "new": true
          }));

        case 9:
          updatedPatientClinic = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Clinic patient is surveyed successfully!',
            clinicPatient: updatedPatientClinic
          }));

        case 13:
          _context6.prev = 13;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  getClinicsPatients: getClinicsPatients,
  getClinicPatientsByClinicId: getClinicPatientsByClinicId,
  addClinicPatient: addClinicPatient,
  deleteClinicPatient: deleteClinicPatient,
  addClinicPatientByCardId: addClinicPatientByCardId,
  setClinicPatientSurveyed: setClinicPatientSurveyed
};