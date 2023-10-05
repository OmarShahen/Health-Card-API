"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var PatientModel = require('../models/PatientModel');

var UserModel = require('../models/UserModel');

var CounterModel = require('../models/CounterModel');

var EncounterModel = require('../models/EncounterModel');

var patientValidation = require('../validations/patients');

var ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel');

var ClinicPatientModel = require('../models/ClinicPatientModel');

var mongoose = require('mongoose');

var ClinicModel = require('../models/ClinicModel');

var utils = require('../utils/utils');

var CardModel = require('../models/CardModel');

var translations = require('../i18n/index');

var ClinicSubscriptionModel = require('../models/followup-service/ClinicSubscriptionModel');

var addPatient = function addPatient(request, response) {
  var dataValidation, _request$body, cardId, cvc, clinicId, doctorsIds, lastVisitDate, card, clinic, doctorsList, doctorsSet, doctorsUniqueList, patientData, counter, patientObj, newPatient, newClinicPatient, newClinicPatientDoctorList, clinicPatientDoctorList, clinicPatientData, clinicPatientObj, _clinicPatientData, _clinicPatientObj, newCard, cardData, cardObj;

  return regeneratorRuntime.async(function addPatient$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = patientValidation.addPatient(request.body);

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
          _request$body = request.body, cardId = _request$body.cardId, cvc = _request$body.cvc, clinicId = _request$body.clinicId, doctorsIds = _request$body.doctorsIds, lastVisitDate = _request$body.lastVisitDate;

          if (!cardId) {
            _context.next = 11;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(PatientModel.find({
            cardId: cardId
          }));

        case 8:
          card = _context.sent;

          if (!(card.length != 0)) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Card ID is already used'],
            field: 'cardId'
          }));

        case 11:
          if (!clinicId) {
            _context.next = 17;
            break;
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(ClinicModel.findById(clinicId));

        case 14:
          clinic = _context.sent;

          if (clinic) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id is not registered',
            field: 'clinicId'
          }));

        case 17:
          doctorsList = [];

          if (!(doctorsIds && doctorsIds.length != 0)) {
            _context.next = 26;
            break;
          }

          doctorsSet = new Set(doctorsIds);
          doctorsUniqueList = _toConsumableArray(doctorsSet);
          _context.next = 23;
          return regeneratorRuntime.awrap(UserModel.find({
            _id: {
              $in: doctorsUniqueList
            }
          }));

        case 23:
          doctorsList = _context.sent;

          if (!(doctorsList.length == 0)) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctors Ids is not registered',
            field: 'doctorsIds'
          }));

        case 26:
          patientData = _objectSpread({}, request.body);
          _context.next = 29;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'patient'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 29:
          counter = _context.sent;
          patientData.patientId = counter.value;
          patientObj = new PatientModel(patientData);
          _context.next = 34;
          return regeneratorRuntime.awrap(patientObj.save());

        case 34:
          newPatient = _context.sent;

          if (!(clinicId && doctorsList.length != 0)) {
            _context.next = 47;
            break;
          }

          clinicPatientDoctorList = doctorsList.map(function (doctor) {
            return {
              patientId: newPatient._id,
              clinicId: clinicId,
              doctorId: doctor._id
            };
          });
          _context.next = 39;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.insertMany(clinicPatientDoctorList));

        case 39:
          newClinicPatientDoctorList = _context.sent;
          clinicPatientData = {
            patientId: newPatient._id,
            clinicId: clinicId,
            lastVisitDate: lastVisitDate,
            registeredById: request.user._id
          };
          clinicPatientObj = new ClinicPatientModel(clinicPatientData);
          _context.next = 44;
          return regeneratorRuntime.awrap(clinicPatientObj.save());

        case 44:
          newClinicPatient = _context.sent;
          _context.next = 53;
          break;

        case 47:
          if (!clinicId) {
            _context.next = 53;
            break;
          }

          _clinicPatientData = {
            patientId: newPatient._id,
            clinicId: clinicId,
            lastVisitDate: lastVisitDate,
            registeredById: request.user._id
          };
          _clinicPatientObj = new ClinicPatientModel(_clinicPatientData);
          _context.next = 52;
          return regeneratorRuntime.awrap(_clinicPatientObj.save());

        case 52:
          newClinicPatient = _context.sent;

        case 53:
          newCard = {};

          if (!cardId) {
            _context.next = 60;
            break;
          }

          cardData = {
            cardId: cardId,
            cvc: cvc
          };
          cardObj = new CardModel(cardData);
          _context.next = 59;
          return regeneratorRuntime.awrap(cardObj.save());

        case 59:
          newCard = _context.sent;

        case 60:
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added patient successfully!'],
            patient: newPatient,
            card: newCard,
            clinicPatient: newClinicPatient,
            clinicPatientDoctorList: newClinicPatientDoctorList
          }));

        case 63:
          _context.prev = 63;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 67:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 63]]);
};

var updatePatient = function updatePatient(request, response) {
  var dataValidation, patientId, updatePatientData, updatedPatient;
  return regeneratorRuntime.async(function updatePatient$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = patientValidation.updatePatient(request.body);

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
          patientId = request.params.patientId;
          updatePatientData = _objectSpread({}, request.body);
          _context2.next = 8;
          return regeneratorRuntime.awrap(PatientModel.findByIdAndUpdate(patientId, updatePatientData, {
            "new": true
          }));

        case 8:
          updatedPatient = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Patient updated successfully!'],
            patient: updatedPatient
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

var getPatientInfo = function getPatientInfo(request, response) {
  var patientId, patientPromise, encountersPromise, _ref, _ref2, patient, encounters;

  return regeneratorRuntime.async(function getPatientInfo$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          patientId = request.params.patientId;
          patientPromise = PatientModel.findById(patientId);
          encountersPromise = EncounterModel.aggregate([{
            $match: {
              patientId: mongoose.Types.ObjectId(patientId)
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]);
          _context3.next = 6;
          return regeneratorRuntime.awrap(Promise.all([patientPromise, encountersPromise]));

        case 6:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 2);
          patient = _ref2[0];
          encounters = _ref2[1];
          encounters.forEach(function (encounter) {
            return encounter.patient = encounter.patient[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            patient: patient,
            encounters: encounters
          }));

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var getPatient = function getPatient(request, response) {
  var patientId, patient;
  return regeneratorRuntime.async(function getPatient$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          patientId = request.params.patientId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId));

        case 4:
          patient = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            patient: patient
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

var getPatientByCardId = function getPatientByCardId(request, response) {
  var cardId, cardList, card, patientList, patient;
  return regeneratorRuntime.async(function getPatientByCardId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          cardId = request.params.cardId;

          if (!isNaN(Number.parseInt(cardId))) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'invalid card ID format',
            field: 'cardId'
          }));

        case 4:
          _context5.next = 6;
          return regeneratorRuntime.awrap(CardModel.find({
            cardId: cardId
          }));

        case 6:
          cardList = _context5.sent;

          if (!(cardList.length == 0)) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'card ID is not registered',
            field: 'cardId'
          }));

        case 9:
          card = cardList[0];

          if (card.isActive) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Card is deactivated',
            field: 'cardId'
          }));

        case 12:
          _context5.next = 14;
          return regeneratorRuntime.awrap(PatientModel.find({
            cardId: cardId
          }));

        case 14:
          patientList = _context5.sent;
          patient = patientList[0] || null;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            patient: patient
          }));

        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var addDoctorToPatient = function addDoctorToPatient(request, response) {
  var cardId, doctorId, dataValidation, doctor, patientList, patient, patientDoctorsIds, additionData, updatedPatient;
  return regeneratorRuntime.async(function addDoctorToPatient$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          cardId = request.params.cardId;
          doctorId = request.body.doctorId;
          dataValidation = patientValidation.addDoctorToPatient(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 6;
            break;
          }

          return _context6.abrupt("return", response.status(500).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 6:
          _context6.next = 8;
          return regeneratorRuntime.awrap(UserModel.findById(doctorId));

        case 8:
          doctor = _context6.sent;

          if (doctor) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor Id is not registered',
            field: 'doctorId'
          }));

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(PatientModel.find({
            cardId: cardId
          }));

        case 13:
          patientList = _context6.sent;

          if (!(patientList.length == 0)) {
            _context6.next = 16;
            break;
          }

          return _context6.abrupt("return", response.status(404).json({
            accepted: false,
            message: 'card Id is not registered',
            field: 'cardId'
          }));

        case 16:
          patient = patientList[0];
          patientDoctorsIds = patient.doctors.map(function (doctor) {
            return doctor.doctorId;
          });

          if (!patientDoctorsIds.includes(doctorId)) {
            _context6.next = 20;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Doctor is already registered with the patient'],
            field: 'doctorId'
          }));

        case 20:
          additionData = {
            doctorId: doctorId,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          _context6.next = 23;
          return regeneratorRuntime.awrap(PatientModel.findByIdAndUpdate(patient._id, {
            $push: {
              doctors: additionData
            }
          }, {
            "new": true
          }));

        case 23:
          updatedPatient = _context6.sent;
          updatedPatient.password = undefined;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Doctor is added successfully to the patient'],
            updatedPatient: updatedPatient
          }));

        case 28:
          _context6.prev = 28;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 32:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var getPatientsByClinicId = function getPatientsByClinicId(request, response) {
  var clinicId, _utils$statsQueryGene, searchQuery, patients;

  return regeneratorRuntime.async(function getPatientsByClinicId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context7.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.aggregate([{
            $match: searchQuery
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 5:
          patients = _context7.sent;
          patients.forEach(function (patient) {
            patient.patient = patient.patient[0];
            patient.patient.emergencyContacts = undefined;
            patient.patient.healthHistory = undefined;
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            patients: patients
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

var getFollowupRegisteredClinicsPatients = function getFollowupRegisteredClinicsPatients(request, response) {
  var subscriptionList, clinicsIds, uniqueClinicIdsSet, uniqueClinicIdsList, _utils$statsQueryGene2, searchQuery, patients;

  return regeneratorRuntime.async(function getFollowupRegisteredClinicsPatients$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(ClinicSubscriptionModel.find({
            isActive: true,
            endDate: {
              $gt: Date.now()
            }
          }));

        case 3:
          subscriptionList = _context8.sent;
          clinicsIds = subscriptionList.map(function (subscription) {
            return subscription.clinicId;
          });
          uniqueClinicIdsSet = new Set(clinicsIds);
          uniqueClinicIdsList = _toConsumableArray(uniqueClinicIdsSet);
          _utils$statsQueryGene2 = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          searchQuery.clinicId = {
            $in: uniqueClinicIdsList
          };
          _context8.next = 11;
          return regeneratorRuntime.awrap(ClinicPatientModel.aggregate([{
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
              from: 'specialities',
              localField: 'clinic.speciality',
              foreignField: '_id',
              as: 'speciality'
            }
          }, {
            $lookup: {
              from: 'users',
              localField: 'survey.doneById',
              foreignField: '_id',
              as: 'member'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }]));

        case 11:
          patients = _context8.sent;
          patients.forEach(function (patient) {
            patient.member = patient.member[0];
            patient.patient = patient.patient[0];
            patient.clinic = patient.clinic[0];
            patient.patient.emergencyContacts = undefined;
            patient.patient.healthHistory = undefined;
          });
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            patients: patients
          }));

        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 20:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var getPatientsByDoctorId = function getPatientsByDoctorId(request, response) {
  var userId, _utils$statsQueryGene3, searchQuery, patients;

  return regeneratorRuntime.async(function getPatientsByDoctorId$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('doctorId', userId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;
          _context9.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.aggregate([{
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
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 5:
          patients = _context9.sent;
          patients.forEach(function (patient) {
            patient.patient = patient.patient[0];
            patient.clinic = patient.clinic[0];
          });
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            patients: patients
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

var getDoctorsByPatientId = function getDoctorsByPatientId(request, response) {
  var patientId, doctorsList, doctorsIdsList, doctorsIdsSet, doctorsIds, doctors;
  return regeneratorRuntime.async(function getDoctorsByPatientId$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          patientId = request.params.patientId;
          _context10.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find({
            patientId: patientId
          }));

        case 4:
          doctorsList = _context10.sent;
          doctorsIdsList = doctorsList.map(function (doctor) {
            return doctor.doctorId;
          });
          doctorsIdsSet = new Set(doctorsIdsList);
          doctorsIds = _toConsumableArray(doctorsIdsSet);
          _context10.next = 10;
          return regeneratorRuntime.awrap(UserModel.aggregate([{
            $match: {
              _id: {
                $in: doctorsIds
              }
            }
          }, {
            $lookup: {
              from: 'specialities',
              localField: 'speciality',
              foreignField: '_id',
              as: 'specialities'
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              password: 0,
              resetPassword: 0,
              deleteAccount: 0
            }
          }]));

        case 10:
          doctors = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            doctors: doctors
          }));

        case 14:
          _context10.prev = 14;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 18:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var getPatientsByRegisteredById = function getPatientsByRegisteredById(request, response) {
  var userId, _utils$statsQueryGene4, searchQuery, patients;

  return regeneratorRuntime.async(function getPatientsByRegisteredById$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene4 = utils.statsQueryGenerator('registeredById', userId, request.query), searchQuery = _utils$statsQueryGene4.searchQuery;
          _context11.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.aggregate([{
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
            $sort: {
              createdAt: -1
            }
          }]));

        case 5:
          patients = _context11.sent;
          patients.forEach(function (patient) {
            patient.patient = patient.patient[0];
            patient.clinic = patient.clinic[0];
            patient.patient.emergencyContacts = undefined;
            patient.patient.healthHistory = undefined;
          });
          return _context11.abrupt("return", response.status(200).json({
            accepted: true,
            patients: patients
          }));

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context11.t0.message
          }));

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var addEmergencyContactToPatient = function addEmergencyContactToPatient(request, response) {
  var patientId, dataValidation, patient, emergencyContacts, phone, countryCode, newContactPhone, patientPhone, samePhones, contactData, updatedPatient;
  return regeneratorRuntime.async(function addEmergencyContactToPatient$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          patientId = request.params.patientId;
          dataValidation = patientValidation.addEmergencyContactToPatient(request.body);

          if (dataValidation.isAccepted) {
            _context12.next = 5;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _context12.next = 7;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId));

        case 7:
          patient = _context12.sent;
          emergencyContacts = patient.emergencyContacts, phone = patient.phone, countryCode = patient.countryCode;
          newContactPhone = "".concat(request.body.countryCode).concat(request.body.phone);
          patientPhone = "".concat(countryCode).concat(phone);

          if (!(patientPhone == newContactPhone)) {
            _context12.next = 13;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Contact phone is the same as patient phone'],
            field: 'phone'
          }));

        case 13:
          samePhones = emergencyContacts.filter(function (contact) {
            var registeredPhone = "".concat(contact.countryCode).concat(contact.phone);
            if (newContactPhone == registeredPhone) return true;
            return false;
          });

          if (!(samePhones.length != 0)) {
            _context12.next = 16;
            break;
          }

          return _context12.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Contact phone is already registered in patient contacts'],
            field: 'phone'
          }));

        case 16:
          contactData = {
            name: request.body.name,
            relation: request.body.relation,
            countryCode: request.body.countryCode,
            phone: request.body.phone
          };
          _context12.next = 19;
          return regeneratorRuntime.awrap(PatientModel.findByIdAndUpdate(patientId, {
            $push: {
              emergencyContacts: contactData
            }
          }, {
            "new": true
          }));

        case 19:
          updatedPatient = _context12.sent;
          return _context12.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Added emergency contact successfully!'],
            patient: updatedPatient
          }));

        case 23:
          _context12.prev = 23;
          _context12.t0 = _context12["catch"](0);
          console.error(_context12.t0);
          return _context12.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context12.t0.message
          }));

        case 27:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var deleteEmergencyContactOfPatient = function deleteEmergencyContactOfPatient(request, response) {
  var _request$params, patientId, countryCode, phone, patient, emergencyContacts, targetContact, updatedContactList, updatedPatient;

  return regeneratorRuntime.async(function deleteEmergencyContactOfPatient$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _request$params = request.params, patientId = _request$params.patientId, countryCode = _request$params.countryCode, phone = _request$params.phone;
          _context13.next = 4;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId));

        case 4:
          patient = _context13.sent;
          emergencyContacts = patient.emergencyContacts;
          targetContact = "".concat(countryCode).concat(phone);
          updatedContactList = emergencyContacts.filter(function (contact) {
            var contactPhone = "".concat(contact.countryCode).concat(contact.phone);
            if (contactPhone == targetContact) return false;
            return true;
          });
          _context13.next = 10;
          return regeneratorRuntime.awrap(PatientModel.findByIdAndUpdate(patientId, {
            emergencyContacts: updatedContactList
          }, {
            "new": true
          }));

        case 10:
          updatedPatient = _context13.sent;
          return _context13.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Deleted emergency contact successfully!'],
            patient: updatedPatient
          }));

        case 14:
          _context13.prev = 14;
          _context13.t0 = _context13["catch"](0);
          console.error(_context13.t0);
          return _context13.abrupt("return", response.status(500).json({
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

var updateEmergencyContactOfPatient = function updateEmergencyContactOfPatient(request, response) {
  var _request$params2, patientId, contactId, dataValidation, patient, emergencyContacts, targetContactList, _request$body2, name, countryCode, phone, relation, newPhone, patientPhone, withOutTargetContactList, patientContacts, newEmergencyContacts, updatedPatient;

  return regeneratorRuntime.async(function updateEmergencyContactOfPatient$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _request$params2 = request.params, patientId = _request$params2.patientId, contactId = _request$params2.contactId;
          dataValidation = patientValidation.updateEmergencyContactOfPatient(request.body);

          if (dataValidation.isAccepted) {
            _context14.next = 5;
            break;
          }

          return _context14.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _context14.next = 7;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId));

        case 7:
          patient = _context14.sent;
          emergencyContacts = patient.emergencyContacts;
          targetContactList = emergencyContacts.filter(function (contact) {
            return contact._id.equals(contactId);
          });

          if (!(targetContactList.length == 0)) {
            _context14.next = 12;
            break;
          }

          return _context14.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'emergency contact does not exists',
            field: 'contactId'
          }));

        case 12:
          _request$body2 = request.body, name = _request$body2.name, countryCode = _request$body2.countryCode, phone = _request$body2.phone, relation = _request$body2.relation;
          newPhone = "".concat(countryCode).concat(phone);
          patientPhone = "".concat(patient.countryCode).concat(patient.phone);
          withOutTargetContactList = emergencyContacts.map(function (contact) {
            return !contact._id.equals(contactId);
          });
          patientContacts = withOutTargetContactList.map(function (contact) {
            return "".concat(contact.countryCode).concat(contact.phone);
          });

          if (!(newPhone == patientPhone)) {
            _context14.next = 19;
            break;
          }

          return _context14.abrupt("return", response.status(200).json({
            accepted: false,
            message: translations[request.query.lang]['Contact phone is the same as patient phone'],
            field: 'phone'
          }));

        case 19:
          if (!patientContacts.includes(newPhone)) {
            _context14.next = 21;
            break;
          }

          return _context14.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Contact phone is already registered in patient contacts'],
            field: 'phone'
          }));

        case 21:
          newEmergencyContacts = emergencyContacts.map(function (contact) {
            if (contact._id.equals(contactId)) {
              return {
                name: name,
                countryCode: countryCode,
                phone: phone,
                relation: relation
              };
            }

            return contact;
          });
          _context14.next = 24;
          return regeneratorRuntime.awrap(PatientModel.findByIdAndUpdate(patientId, {
            emergencyContacts: newEmergencyContacts
          }, {
            "new": true
          }));

        case 24:
          updatedPatient = _context14.sent;
          return _context14.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated patient contact successfully!'],
            patient: updatedPatient
          }));

        case 28:
          _context14.prev = 28;
          _context14.t0 = _context14["catch"](0);
          console.error(_context14.t0);
          return _context14.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context14.t0.message
          }));

        case 32:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var deleteDoctorFromPatient = function deleteDoctorFromPatient(request, response) {
  var _request$params3, patientId, doctorId, patient, doctors, targetDoctorList, updatedDoctorList, updatedPatient;

  return regeneratorRuntime.async(function deleteDoctorFromPatient$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _request$params3 = request.params, patientId = _request$params3.patientId, doctorId = _request$params3.doctorId;
          _context15.next = 4;
          return regeneratorRuntime.awrap(PatientModel.findById(patientId).select({
            doctors: 1
          }));

        case 4:
          patient = _context15.sent;
          doctors = patient.doctors;
          targetDoctorList = doctors.filter(function (doctor) {
            return doctor.doctorId == doctorId;
          });

          if (!(targetDoctorList.length == 0)) {
            _context15.next = 9;
            break;
          }

          return _context15.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Doctor is not registered with the patient'],
            field: 'doctorId'
          }));

        case 9:
          updatedDoctorList = doctors.filter(function (doctor) {
            return doctor.doctorId != doctorId;
          });
          _context15.next = 12;
          return regeneratorRuntime.awrap(PatientModel.findByIdAndUpdate(patientId, {
            doctors: updatedDoctorList
          }, {
            "new": true
          }));

        case 12:
          updatedPatient = _context15.sent;
          return _context15.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Removed patient successfully!'],
            patient: updatedPatient
          }));

        case 16:
          _context15.prev = 16;
          _context15.t0 = _context15["catch"](0);
          console.error(_context15.t0);
          return _context15.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context15.t0.message
          }));

        case 20:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

module.exports = {
  addPatient: addPatient,
  updatePatient: updatePatient,
  addEmergencyContactToPatient: addEmergencyContactToPatient,
  getPatientInfo: getPatientInfo,
  getPatient: getPatient,
  getPatientByCardId: getPatientByCardId,
  addDoctorToPatient: addDoctorToPatient,
  getPatientsByClinicId: getPatientsByClinicId,
  getPatientsByDoctorId: getPatientsByDoctorId,
  getDoctorsByPatientId: getDoctorsByPatientId,
  getPatientsByRegisteredById: getPatientsByRegisteredById,
  deleteEmergencyContactOfPatient: deleteEmergencyContactOfPatient,
  updateEmergencyContactOfPatient: updateEmergencyContactOfPatient,
  deleteDoctorFromPatient: deleteDoctorFromPatient,
  getFollowupRegisteredClinicsPatients: getFollowupRegisteredClinicsPatients
};