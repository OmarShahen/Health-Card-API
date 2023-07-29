"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var encounterValidation = require('../validations/encounters');

var EncounterModel = require('../models/EncounterModel');

var PrescriptionModel = require('../models/PrescriptionModel');

var UserModel = require('../models/UserModel');

var PatientModel = require('../models/PatientModel');

var CounterModel = require('../models/CounterModel');

var ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel');

var ClinicModel = require('../models/ClinicModel');

var mongoose = require('mongoose');

var utils = require('../utils/utils');

var translations = require('../i18n/index');

var addEncounter = function addEncounter(request, response) {
  var dataValidation, _request$body, doctorId, patientId, symptoms, diagnosis, notes, medicines, doctorPromise, patientPromise, _ref, _ref2, doctor, patient, doctorPatientAccessList, counter, encounterData, newPrescription, _counter, prescriptionData, prescriptionObj, encounterObj, newEncounter;

  return regeneratorRuntime.async(function addEncounter$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dataValidation = encounterValidation.addEncounter(request.body);

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
          _request$body = request.body, doctorId = _request$body.doctorId, patientId = _request$body.patientId, symptoms = _request$body.symptoms, diagnosis = _request$body.diagnosis, notes = _request$body.notes, medicines = _request$body.medicines;
          doctorPromise = UserModel.findById(doctorId);
          patientPromise = PatientModel.findById(patientId);
          _context.next = 9;
          return regeneratorRuntime.awrap(Promise.all([doctorPromise, patientPromise]));

        case 9:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          doctor = _ref2[0];
          patient = _ref2[1];

          if (!(!doctor || !doctor.roles.includes('DOCTOR'))) {
            _context.next = 15;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor Id does not exist',
            field: 'doctorId'
          }));

        case 15:
          if (patient) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient Id does not exist',
            field: 'patientId'
          }));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(DoctorPatientAccessModel.find({
            doctorId: doctorId,
            patientId: patientId
          }));

        case 19:
          doctorPatientAccessList = _context.sent;

          if (!(doctorPatientAccessList.length == 0)) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'no access to this patient',
            field: 'patientId'
          }));

        case 22:
          _context.next = 24;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'encounter'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 24:
          counter = _context.sent;
          encounterData = {
            encounterId: counter.value,
            doctorId: doctorId,
            patientId: patientId,
            symptoms: symptoms,
            diagnosis: diagnosis,
            notes: notes
          };

          if (!(medicines && medicines.length != 0)) {
            _context.next = 35;
            break;
          }

          _context.next = 29;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'prescription'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 29:
          _counter = _context.sent;
          prescriptionData = {
            prescriptionId: _counter.value,
            doctorId: doctorId,
            patientId: patientId,
            medicines: medicines
          };
          prescriptionObj = new PrescriptionModel(prescriptionData);
          _context.next = 34;
          return regeneratorRuntime.awrap(prescriptionObj.save());

        case 34:
          newPrescription = _context.sent;

        case 35:
          encounterObj = new EncounterModel(encounterData);
          _context.next = 38;
          return regeneratorRuntime.awrap(encounterObj.save());

        case 38:
          newEncounter = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Encounter added successfully!',
            encounter: newEncounter,
            prescription: newPrescription
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

var addEncounterByPatientCardId = function addEncounterByPatientCardId(request, response) {
  var dataValidation, cardId, _request$body2, doctorId, clinicId, symptoms, diagnosis, registrationDate, notes, medicines, doctorPromise, patientPromise, clinicPromise, _ref3, _ref4, doctor, patientList, clinic, patient, doctorPatientAccessList, counter, encounterData, newPrescription, _counter2, prescriptionData, prescriptionObj, encounterObj, newEncounter;

  return regeneratorRuntime.async(function addEncounterByPatientCardId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = encounterValidation.addEncounterByPatientCardId(request.body);

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
          cardId = request.params.cardId;
          _request$body2 = request.body, doctorId = _request$body2.doctorId, clinicId = _request$body2.clinicId, symptoms = _request$body2.symptoms, diagnosis = _request$body2.diagnosis, registrationDate = _request$body2.registrationDate, notes = _request$body2.notes, medicines = _request$body2.medicines;
          doctorPromise = UserModel.findById(doctorId);
          patientPromise = PatientModel.find({
            cardId: cardId
          });
          clinicPromise = ClinicModel.findById(clinicId);
          _context2.next = 11;
          return regeneratorRuntime.awrap(Promise.all([doctorPromise, patientPromise, clinicPromise]));

        case 11:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 3);
          doctor = _ref4[0];
          patientList = _ref4[1];
          clinic = _ref4[2];

          if (!(!doctor || !doctor.roles.includes('DOCTOR'))) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor Id does not exist',
            field: 'doctorId'
          }));

        case 18:
          if (!(patientList.length == 0)) {
            _context2.next = 20;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient card Id does not exists',
            field: 'cardId'
          }));

        case 20:
          if (clinic) {
            _context2.next = 22;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic Id does not exists',
            field: 'clinicId'
          }));

        case 22:
          patient = patientList[0];
          _context2.next = 25;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find({
            doctorId: doctorId,
            patientId: patient._id,
            clinicId: clinic._id
          }));

        case 25:
          doctorPatientAccessList = _context2.sent;

          if (!(doctorPatientAccessList.length == 0)) {
            _context2.next = 28;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Doctor does not have access to the patient'],
            field: 'patientId'
          }));

        case 28:
          _context2.next = 30;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'encounter'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 30:
          counter = _context2.sent;
          encounterData = {
            encounterId: counter.value,
            clinicId: clinicId,
            patientId: patient._id,
            doctorId: doctorId,
            symptoms: symptoms,
            diagnosis: diagnosis,
            notes: notes,
            createdAt: registrationDate
          };

          if (!(medicines && medicines.length != 0)) {
            _context2.next = 41;
            break;
          }

          _context2.next = 35;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'prescription'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 35:
          _counter2 = _context2.sent;
          prescriptionData = {
            prescriptionId: _counter2.value,
            clinicId: clinicId,
            doctorId: doctorId,
            patientId: patient._id,
            medicines: medicines
          };
          prescriptionObj = new PrescriptionModel(prescriptionData);
          _context2.next = 40;
          return regeneratorRuntime.awrap(prescriptionObj.save());

        case 40:
          newPrescription = _context2.sent;

        case 41:
          encounterObj = new EncounterModel(encounterData);
          _context2.next = 44;
          return regeneratorRuntime.awrap(encounterObj.save());

        case 44:
          newEncounter = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Encounter added successfully!'],
            encounter: newEncounter,
            prescription: newPrescription
          }));

        case 48:
          _context2.prev = 48;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 52:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 48]]);
};

var deleteEncounter = function deleteEncounter(request, response) {
  var encounterId, deletedEncounter;
  return regeneratorRuntime.async(function deleteEncounter$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          encounterId = request.params.encounterId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(EncounterModel.findByIdAndDelete(encounterId));

        case 4:
          deletedEncounter = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Encounter deleted successfully!'],
            encounter: deletedEncounter
          }));

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var getPatientEncounters = function getPatientEncounters(request, response) {
  var patientId, query, _utils$statsQueryGene, searchQuery, encounters;

  return regeneratorRuntime.async(function getPatientEncounters$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          patientId = request.params.patientId;
          query = request.query.query;
          query = query ? query : '';
          _utils$statsQueryGene = utils.statsQueryGenerator('patientId', patientId, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context4.next = 7;
          return regeneratorRuntime.awrap(EncounterModel.aggregate([{
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
              from: 'clinics',
              localField: 'clinicId',
              foreignField: '_id',
              as: 'clinic'
            }
          }, {
            $match: {
              $or: [{
                'doctor.firstName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'doctor.lastName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'doctor.email': {
                  $regex: query,
                  $options: 'i'
                }
              }]
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'doctor.password': 0,
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 7:
          encounters = _context4.sent;
          encounters.forEach(function (encounter) {
            encounter.doctor = encounter.doctor[0];
            encounter.patient = encounter.patient[0];
            encounter.clinic = encounter.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            encounters: encounters
          }));

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getDoctorEncounters = function getDoctorEncounters(request, response) {
  var userId, query, _utils$statsQueryGene2, searchQuery, encounters;

  return regeneratorRuntime.async(function getDoctorEncounters$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          query = request.query.query;
          query = query ? query : '';
          _utils$statsQueryGene2 = utils.statsQueryGenerator('doctorId', userId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context5.next = 7;
          return regeneratorRuntime.awrap(EncounterModel.aggregate([{
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
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $match: {
              $or: [{
                'patient.firstName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.lastName': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.phone': {
                  $regex: query,
                  $options: 'i'
                }
              }, {
                'patient.cardId': {
                  $regex: query,
                  $options: 'i'
                }
              }]
            }
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $project: {
              'doctor.password': 0,
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 7:
          encounters = _context5.sent;
          encounters.forEach(function (encounter) {
            encounter.patient = encounter.patient[0];
            encounter.doctor = encounter.doctor[0];
            encounter.clinic = encounter.clinic[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            encounters: encounters
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

var getEncounter = function getEncounter(request, response) {
  var encounterId, encounter;
  return regeneratorRuntime.async(function getEncounter$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          encounterId = request.params.encounterId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(EncounterModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(encounterId)
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
              from: 'users',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctor'
            }
          }, {
            $project: {
              'doctor.password': 0,
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0,
              'patient.doctors': 0
            }
          }]));

        case 4:
          encounter = _context6.sent;
          encounter.forEach(function (encounter) {
            encounter.patient = encounter.patient[0];
            encounter.doctor = encounter.doctor[0];
          });
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            encounter: encounter[0]
          }));

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var updateEncounter = function updateEncounter(request, response) {
  var encounterId, dataValidation, _request$body3, symptoms, diagnosis, notes, updatedEncounter;

  return regeneratorRuntime.async(function updateEncounter$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          encounterId = request.params.encounterId;
          dataValidation = encounterValidation.updateEncounter(request.body);

          if (dataValidation.isAccepted) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _request$body3 = request.body, symptoms = _request$body3.symptoms, diagnosis = _request$body3.diagnosis, notes = _request$body3.notes;
          _context7.next = 8;
          return regeneratorRuntime.awrap(EncounterModel.findByIdAndUpdate(encounterId, {
            symptoms: symptoms,
            diagnosis: diagnosis,
            notes: notes
          }, {
            "new": true
          }));

        case 8:
          updatedEncounter = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Updated encounter successfully!'],
            encounter: updatedEncounter
          }));

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  addEncounter: addEncounter,
  deleteEncounter: deleteEncounter,
  getPatientEncounters: getPatientEncounters,
  getDoctorEncounters: getDoctorEncounters,
  getEncounter: getEncounter,
  addEncounterByPatientCardId: addEncounterByPatientCardId,
  updateEncounter: updateEncounter
};