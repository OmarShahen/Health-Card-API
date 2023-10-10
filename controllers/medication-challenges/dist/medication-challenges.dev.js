"use strict";

var MedicationChallengeModel = require('../../models/medication-challenges/MedicationChallenges');

var CounterModel = require('../../models/CounterModel');

var TreatmentSurveyModel = require('../../models/followup-service/TreatmentSurveyModel');

var medicationChallengeValidation = require('../../validations/medication-challenges/medication-challenges');

var getMedicationChallenges = function getMedicationChallenges(request, response) {
  var category, searchQuery, medicationChallenges;
  return regeneratorRuntime.async(function getMedicationChallenges$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          category = request.query.category;
          searchQuery = category ? {
            category: category
          } : {};
          _context.next = 5;
          return regeneratorRuntime.awrap(MedicationChallengeModel.find(searchQuery).sort({
            createdAt: -1
          }));

        case 5:
          medicationChallenges = _context.sent;
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            medicationChallenges: medicationChallenges
          }));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: errror.message
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var addMedicationChallenge = function addMedicationChallenge(request, response) {
  var dataValidation, _request$body, name, description, category, medicationChallengesList, counter, medicationChallengeData, medicationChallengeObj, newMedicationChallenge;

  return regeneratorRuntime.async(function addMedicationChallenge$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          dataValidation = medicationChallengeValidation.addMedicationChallenge(request.body);

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
          _request$body = request.body, name = _request$body.name, description = _request$body.description, category = _request$body.category;
          _context2.next = 7;
          return regeneratorRuntime.awrap(MedicationChallengeModel.find({
            name: name,
            category: category
          }));

        case 7:
          medicationChallengesList = _context2.sent;

          if (!(medicationChallengesList.length != 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Medication challenge name is already registered',
            field: 'name'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: "medicationChallenge"
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 12:
          counter = _context2.sent;
          medicationChallengeData = {
            medicationChallengeId: counter.value,
            name: name,
            description: description,
            category: category
          };
          medicationChallengeObj = new MedicationChallengeModel(medicationChallengeData);
          _context2.next = 17;
          return regeneratorRuntime.awrap(medicationChallengeObj.save());

        case 17:
          newMedicationChallenge = _context2.sent;
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'New medication challenge is added successfully!',
            medicationChallenge: newMedicationChallenge
          }));

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

var updateMedicationChallenge = function updateMedicationChallenge(request, response) {
  var dataValidation, medicationChallengeId, _request$body2, name, description, category, medicalChalllenge, nameList, medicationChallengeData, updatedMedicationChallenge;

  return regeneratorRuntime.async(function updateMedicationChallenge$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          dataValidation = medicationChallengeValidation.updateMedicationChallenge(request.body);

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
          medicationChallengeId = request.params.medicationChallengeId;
          _request$body2 = request.body, name = _request$body2.name, description = _request$body2.description, category = _request$body2.category;
          _context3.next = 8;
          return regeneratorRuntime.awrap(MedicationChallengeModel.findById(medicationChallengeId));

        case 8:
          medicalChalllenge = _context3.sent;

          if (!(name != medicalChalllenge.name && medicalChalllenge.category == category)) {
            _context3.next = 15;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(MedicationChallengeModel.find({
            name: name,
            category: category
          }));

        case 12:
          nameList = _context3.sent;

          if (!(nameList.length != 0)) {
            _context3.next = 15;
            break;
          }

          return _context3.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Medication challenge name is already registered',
            field: 'name'
          }));

        case 15:
          medicationChallengeData = {
            name: name,
            description: description,
            category: category
          };
          _context3.next = 18;
          return regeneratorRuntime.awrap(MedicationChallengeModel.findByIdAndUpdate(medicationChallengeId, medicationChallengeData, {
            "new": true
          }));

        case 18:
          updatedMedicationChallenge = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated medication challenge successfully!',
            medicationChallenge: updatedMedicationChallenge
          }));

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context3.t0.message
          }));

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var deleteMedicationChallenge = function deleteMedicationChallenge(request, response) {
  var medicationChallengeId, treatmentsSurveys, deletedMedicationChallenge;
  return regeneratorRuntime.async(function deleteMedicationChallenge$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          medicationChallengeId = request.params.medicationChallengeId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.find({
            $or: [{
              challengesTakingMedication: {
                $in: [medicationChallengeId]
              }
            }, {
              challengesObtainingMedication: {
                $in: [medicationChallengeId]
              }
            }]
          }));

        case 4:
          treatmentsSurveys = _context4.sent;

          if (!(treatmentsSurveys.length != 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Medication challenge is registered with treatment survey',
            field: 'medicationChallengeId'
          }));

        case 7:
          _context4.next = 9;
          return regeneratorRuntime.awrap(MedicationChallengeModel.findByIdAndDelete(medicationChallengeId));

        case 9:
          deletedMedicationChallenge = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted medication challenge successfully!',
            medicationChallenge: deletedMedicationChallenge
          }));

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  getMedicationChallenges: getMedicationChallenges,
  addMedicationChallenge: addMedicationChallenge,
  updateMedicationChallenge: updateMedicationChallenge,
  deleteMedicationChallenge: deleteMedicationChallenge
};