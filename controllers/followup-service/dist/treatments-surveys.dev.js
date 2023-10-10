"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var TreatmentSurveyModel = require('../../models/followup-service/TreatmentSurveyModel');

var MedicationChallengeModel = require('../../models/medication-challenges/MedicationChallenges');

var PatientModel = require('../../models/PatientModel');

var ClinicModel = require('../../models/ClinicModel');

var UserModel = require('../../models/UserModel');

var CallModel = require('../../models/followup-service/CallModel');

var CounterModel = require('../../models/CounterModel');

var treatmentSurveyValidation = require('../../validations/followup-service/treatments-surveys');

var utils = require('../../utils/utils');

var getTreatmentsSurveys = function getTreatmentsSurveys(request, response) {
  var _utils$statsQueryGene, searchQuery, treatmentsSurveys;

  return regeneratorRuntime.async(function getTreatmentsSurveys$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doneById',
              foreignField: '_id',
              as: 'member'
            }
          }, {
            $project: {
              'patient.emergencyContacts': 0,
              'patient.healthHistory': 0,
              'member.password': 0
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 4:
          treatmentsSurveys = _context.sent;
          treatmentsSurveys.forEach(function (treatmentSurvey) {
            treatmentSurvey.patient = treatmentSurvey.patient[0];
            treatmentSurvey.member = treatmentSurvey.member[0];
            treatmentSurvey.clinic = treatmentSurvey.clinic[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            treatmentsSurveys: treatmentsSurveys
          }));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: _context.t0.message
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getTreatmentsSurveysByPatientId = function getTreatmentsSurveysByPatientId(request, response) {
  var patientId, _utils$statsQueryGene2, searchQuery, treatmentsSurveys;

  return regeneratorRuntime.async(function getTreatmentsSurveysByPatientId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          patientId = request.params.patientId;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('patientId', patientId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context2.next = 5;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doneById',
              foreignField: '_id',
              as: 'member'
            }
          }, {
            $project: {
              'patient.emergencyContacts': 0,
              'patient.healthHistory': 0,
              'member.password': 0
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 5:
          treatmentsSurveys = _context2.sent;
          treatmentsSurveys.forEach(function (treatmentSurvey) {
            treatmentSurvey.patient = treatmentSurvey.patient[0];
            treatmentSurvey.member = treatmentSurvey.member[0];
            treatmentSurvey.clinic = treatmentSurvey.clinic[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            treatmentsSurveys: treatmentsSurveys
          }));

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: _context2.t0.message
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var getTreatmentsSurveysByClinicId = function getTreatmentsSurveysByClinicId(request, response) {
  var clinicId, _utils$statsQueryGene3, searchQuery, treatmentsSurveys;

  return regeneratorRuntime.async(function getTreatmentsSurveysByClinicId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;
          _context3.next = 5;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $lookup: {
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'doneById',
              foreignField: '_id',
              as: 'member'
            }
          }, {
            $project: {
              'patient.emergencyContacts': 0,
              'patient.healthHistory': 0,
              'member.password': 0
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 5:
          treatmentsSurveys = _context3.sent;
          treatmentsSurveys.forEach(function (treatmentSurvey) {
            treatmentSurvey.patient = treatmentSurvey.patient[0];
            treatmentSurvey.member = treatmentSurvey.member[0];
            treatmentSurvey.clinic = treatmentSurvey.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            treatmentsSurveys: treatmentsSurveys
          }));

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: _context3.t0.message
          }));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var addTreatmentSurvey = function addTreatmentSurvey(request, response) {
  var dataValidation, _request$body, clinicId, patientId, doneById, callDuration, challengesTakingMedication, challengesObtainingMedication, memberPromise, patientPromise, clinicPromise, _ref, _ref2, member, patient, clinic, medicationChallenges, _medicationChallenges, counter, treatmentSurveyData, TreatmentSurveyObj, newTreatmentSurvey, newCall, _counter, callData, callObj;

  return regeneratorRuntime.async(function addTreatmentSurvey$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = treatmentSurveyValidation.addTreatmentSurvey(request.body);

          if (dataValidation.isAccepted) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body = request.body, clinicId = _request$body.clinicId, patientId = _request$body.patientId, doneById = _request$body.doneById, callDuration = _request$body.callDuration, challengesTakingMedication = _request$body.challengesTakingMedication, challengesObtainingMedication = _request$body.challengesObtainingMedication;
          memberPromise = UserModel.findById(doneById);
          patientPromise = PatientModel.findById(patientId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context4.next = 10;
          return regeneratorRuntime.awrap(Promise.all([memberPromise, patientPromise, clinicPromise]));

        case 10:
          _ref = _context4.sent;
          _ref2 = _slicedToArray(_ref, 3);
          member = _ref2[0];
          patient = _ref2[1];
          clinic = _ref2[2];

          if (member) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Member ID does not exist',
            field: 'doneById'
          }));

        case 17:
          if (patient) {
            _context4.next = 19;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient ID does not exist',
            field: 'patientId'
          }));

        case 19:
          if (clinic) {
            _context4.next = 21;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID does not exist',
            field: 'clinicId'
          }));

        case 21:
          if (!(challengesTakingMedication && challengesTakingMedication.length != 0)) {
            _context4.next = 27;
            break;
          }

          _context4.next = 24;
          return regeneratorRuntime.awrap(MedicationChallengeModel.find({
            _id: {
              $in: challengesTakingMedication
            }
          }));

        case 24:
          medicationChallenges = _context4.sent;

          if (!(medicationChallenges.length == 0)) {
            _context4.next = 27;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Challenges Ids is not valid',
            field: 'challengesTakingMedication'
          }));

        case 27:
          if (!(challengesObtainingMedication && challengesObtainingMedication.length != 0)) {
            _context4.next = 33;
            break;
          }

          _context4.next = 30;
          return regeneratorRuntime.awrap(MedicationChallengeModel.find({
            _id: {
              $in: challengesObtainingMedication
            }
          }));

        case 30:
          _medicationChallenges = _context4.sent;

          if (!(_medicationChallenges.length == 0)) {
            _context4.next = 33;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Challenges Ids is not valid',
            field: 'challengesObtainingMedication'
          }));

        case 33:
          _context4.next = 35;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'TreatmentSurvey'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 35:
          counter = _context4.sent;
          treatmentSurveyData = _objectSpread({
            treatmentSurveyId: counter.value
          }, request.body);
          TreatmentSurveyObj = new TreatmentSurveyModel(treatmentSurveyData);
          _context4.next = 40;
          return regeneratorRuntime.awrap(TreatmentSurveyObj.save());

        case 40:
          newTreatmentSurvey = _context4.sent;
          newCall = {};

          if (!callDuration) {
            _context4.next = 51;
            break;
          }

          _context4.next = 45;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'call'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 45:
          _counter = _context4.sent;
          callData = {
            callId: _counter.value,
            patientId: patientId,
            clinicId: clinicId,
            doneById: doneById,
            treatmentSurveyId: newTreatmentSurvey._id,
            duration: callDuration
          };
          callObj = new CallModel(callData);
          _context4.next = 50;
          return regeneratorRuntime.awrap(callObj.save());

        case 50:
          newCall = _context4.sent;

        case 51:
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added treatment survey successfully!',
            treatmentSurvey: newTreatmentSurvey
          }));

        case 54:
          _context4.prev = 54;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            messsage: 'internal server error',
            error: _context4.t0.message
          }));

        case 58:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 54]]);
};

var updateTreatmentSurvey = function updateTreatmentSurvey(request, response) {
  var treatmentSurveyId, _request$body2, challengesTakingMedication, challengesObtainingMedication, dataValidation, medicationChallenges, _medicationChallenges2, updatedTreatmentSurvey;

  return regeneratorRuntime.async(function updateTreatmentSurvey$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          treatmentSurveyId = request.params.treatmentSurveyId;
          _request$body2 = request.body, challengesTakingMedication = _request$body2.challengesTakingMedication, challengesObtainingMedication = _request$body2.challengesObtainingMedication;
          dataValidation = treatmentSurveyValidation.updateTreatmentSurvey(request.body);

          if (dataValidation.isAccepted) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          if (!(challengesTakingMedication && challengesTakingMedication.length != 0)) {
            _context5.next = 12;
            break;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(MedicationChallengeModel.find({
            _id: {
              $in: challengesTakingMedication
            }
          }));

        case 9:
          medicationChallenges = _context5.sent;

          if (!(medicationChallenges.length == 0)) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Challenges Ids is not valid',
            field: 'challengesTakingMedication'
          }));

        case 12:
          if (!(challengesObtainingMedication && challengesObtainingMedication.length != 0)) {
            _context5.next = 18;
            break;
          }

          _context5.next = 15;
          return regeneratorRuntime.awrap(MedicationChallengeModel.find({
            _id: {
              $in: challengesObtainingMedication
            }
          }));

        case 15:
          _medicationChallenges2 = _context5.sent;

          if (!(_medicationChallenges2.length == 0)) {
            _context5.next = 18;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Challenges Ids is not valid',
            field: 'challengesObtainingMedication'
          }));

        case 18:
          _context5.next = 20;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.findByIdAndUpdate(treatmentSurveyId, request.body, {
            "new": true
          }));

        case 20:
          updatedTreatmentSurvey = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated treatment survey successfully!',
            treatmentSurvey: updatedTreatmentSurvey
          }));

        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 28:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var deleteTreatmentSurvey = function deleteTreatmentSurvey(request, response) {
  var treatmentSurveyId, deletedTreatmentSurvey;
  return regeneratorRuntime.async(function deleteTreatmentSurvey$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          treatmentSurveyId = request.params.treatmentSurveyId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.findByIdAndDelete(treatmentSurveyId));

        case 4:
          deletedTreatmentSurvey = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted treatment survey successfully!',
            treatmentSurvey: deletedTreatmentSurvey
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

module.exports = {
  getTreatmentsSurveys: getTreatmentsSurveys,
  getTreatmentsSurveysByPatientId: getTreatmentsSurveysByPatientId,
  getTreatmentsSurveysByClinicId: getTreatmentsSurveysByClinicId,
  addTreatmentSurvey: addTreatmentSurvey,
  updateTreatmentSurvey: updateTreatmentSurvey,
  deleteTreatmentSurvey: deleteTreatmentSurvey
};