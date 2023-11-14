"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ClinicPatientModel = require('../models/ClinicPatientModel');

var ClinicPatientDoctorModel = require('../models/ClinicPatientDoctorModel');

var clinicPatientValidation = require('../validations/clinics-patients');

var PatientModel = require('../models/PatientModel');

var ClinicModel = require('../models/ClinicModel');

var LabelModel = require('../models/labels/LabelModel');

var CardModel = require('../models/CardModel');

var translations = require('../i18n/index');

var mongoose = require('mongoose');

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

var searchClinicsPatients = function searchClinicsPatients(request, response) {
  var clinicId, firstName, patients;
  return regeneratorRuntime.async(function searchClinicsPatients$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          clinicId = request.params.clinicId;
          firstName = request.query.firstName;
          firstName = firstName ? firstName : '';
          _context2.next = 6;
          return regeneratorRuntime.awrap(ClinicPatientModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patient'
            }
          }, {
            $match: {
              $or: [{
                'patient.firstName': {
                  $regex: firstName,
                  $options: 'i'
                }
              }]
            }
          }, {
            $limit: 10
          }]));

        case 6:
          patients = _context2.sent;
          patients.map(function (patient) {
            return patient.patient = patient.patient[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            patients: patients
          }));

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context2.t0.message
          }));

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getClinicPatientsByClinicId = function getClinicPatientsByClinicId(request, response) {
  var clinicId, clinicsPatients;
  return regeneratorRuntime.async(function getClinicPatientsByClinicId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            clinicId: clinicId
          }).sort({
            createdAt: -1
          }));

        case 4:
          clinicsPatients = _context3.sent;
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            clinicsPatients: clinicsPatients
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

var addClinicPatient = function addClinicPatient(request, response) {
  var dataValidation, _request$body, patientId, clinicId, patientPromise, clinicPromise, _ref, _ref2, patient, clinic, registeredClinicPatientList, clinicPatientData, clinicPatientObj, newClinicPatient;

  return regeneratorRuntime.async(function addClinicPatient$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          dataValidation = clinicPatientValidation.addClinicPatient(request.body);

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
          _request$body = request.body, patientId = _request$body.patientId, clinicId = _request$body.clinicId;
          patientPromise = PatientModel.findById(patientId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context4.next = 9;
          return regeneratorRuntime.awrap(Promise.all([patientPromise, clinicPromise]));

        case 9:
          _ref = _context4.sent;
          _ref2 = _slicedToArray(_ref, 2);
          patient = _ref2[0];
          clinic = _ref2[1];

          if (patient) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'patient Id does not exists',
            field: 'patientId'
          }));

        case 15:
          if (clinic) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            patientId: patientId,
            clinicId: clinicId
          }));

        case 19:
          registeredClinicPatientList = _context4.sent;

          if (!(registeredClinicPatientList.length != 0)) {
            _context4.next = 22;
            break;
          }

          return _context4.abrupt("return", response.status(400).json({
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
          _context4.next = 26;
          return regeneratorRuntime.awrap(clinicPatientObj.save());

        case 26:
          newClinicPatient = _context4.sent;
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'registered patient to clinic successfully!',
            clinicPatient: newClinicPatient
          }));

        case 30:
          _context4.prev = 30;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 34:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 30]]);
};

var deleteClinicPatient = function deleteClinicPatient(request, response) {
  var lang, clinicPatientId, deletedClinicPatient;
  return regeneratorRuntime.async(function deleteClinicPatient$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          lang = request.query.lang;
          clinicPatientId = request.params.clinicPatientId;
          _context5.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.findByIdAndDelete(clinicPatientId));

        case 5:
          deletedClinicPatient = _context5.sent;
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic patient access successfully!'],
            clinicPatient: deletedClinicPatient
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

var addClinicPatientByCardId = function addClinicPatientByCardId(request, response) {
  var dataValidation, _request$body2, cardId, cvc, clinicId, cardList, card, patientListPromise, clinicPromise, _ref3, _ref4, patientList, clinic, patient, patientId, registeredClinicPatientList, clinicPatientData, clinicPatientObj, newClinicPatient;

  return regeneratorRuntime.async(function addClinicPatientByCardId$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = clinicPatientValidation.addClinicPatientByCardId(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          _request$body2 = request.body, cardId = _request$body2.cardId, cvc = _request$body2.cvc, clinicId = _request$body2.clinicId;
          _context6.next = 7;
          return regeneratorRuntime.awrap(CardModel.find({
            cardId: cardId,
            cvc: cvc
          }));

        case 7:
          cardList = _context6.sent;

          if (!(cardList.length == 0)) {
            _context6.next = 10;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Invalid card credentials'],
            field: 'cardId'
          }));

        case 10:
          card = cardList[0];

          if (card.isActive) {
            _context6.next = 13;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['Card is deactivated'],
            field: 'cardId'
          }));

        case 13:
          patientListPromise = PatientModel.find({
            cardId: cardId
          });
          clinicPromise = ClinicModel.findById(clinicId);
          _context6.next = 17;
          return regeneratorRuntime.awrap(Promise.all([patientListPromise, clinicPromise]));

        case 17:
          _ref3 = _context6.sent;
          _ref4 = _slicedToArray(_ref3, 2);
          patientList = _ref4[0];
          clinic = _ref4[1];

          if (!(patientList.length == 0)) {
            _context6.next = 23;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: translations[request.query.lang]['No patient is registered with the card'],
            field: 'cardId'
          }));

        case 23:
          if (clinic) {
            _context6.next = 25;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'clinic Id does not exists',
            field: 'clinicId'
          }));

        case 25:
          patient = patientList[0];
          patientId = patient._id;
          _context6.next = 29;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            patientId: patientId,
            clinicId: clinicId
          }));

        case 29:
          registeredClinicPatientList = _context6.sent;

          if (!(registeredClinicPatientList.length != 0)) {
            _context6.next = 32;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
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
          _context6.next = 36;
          return regeneratorRuntime.awrap(clinicPatientObj.save());

        case 36:
          newClinicPatient = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: translations[request.query.lang]['Registered patient to clinic successfully!'],
            clinicPatient: newClinicPatient
          }));

        case 40:
          _context6.prev = 40;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 44:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 40]]);
};

var setClinicPatientSurveyed = function setClinicPatientSurveyed(request, response) {
  var clinicPatientId, isSurveyed, surveyData, updatedPatientClinic;
  return regeneratorRuntime.async(function setClinicPatientSurveyed$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          clinicPatientId = request.params.clinicPatientId;
          isSurveyed = request.body.isSurveyed;

          if (!(typeof isSurveyed != 'boolean')) {
            _context7.next = 5;
            break;
          }

          return _context7.abrupt("return", response.status(400).json({
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

          _context7.next = 9;
          return regeneratorRuntime.awrap(ClinicPatientModel.findByIdAndUpdate(clinicPatientId, surveyData, {
            "new": true
          }));

        case 9:
          updatedPatientClinic = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Clinic patient is surveyed successfully!',
            clinicPatient: updatedPatientClinic
          }));

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          console.error(_context7.t0);
          return _context7.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context7.t0.message
          }));

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var addClinicPatientLabel = function addClinicPatientLabel(request, response) {
  var dataValidation, clinicPatientId, labelId, label, clinicPatientsLabelList, updatedClinicPatient;
  return regeneratorRuntime.async(function addClinicPatientLabel$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          dataValidation = clinicPatientValidation.addPatientClinicLabel(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 4:
          clinicPatientId = request.params.clinicPatientId;
          labelId = request.body.labelId;
          _context8.next = 8;
          return regeneratorRuntime.awrap(LabelModel.findById(labelId));

        case 8:
          label = _context8.sent;

          if (label) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Label ID does not exist',
            field: 'labelId'
          }));

        case 11:
          _context8.next = 13;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            _id: clinicPatientId,
            labels: {
              $in: [label._id]
            }
          }));

        case 13:
          clinicPatientsLabelList = _context8.sent;

          if (!(clinicPatientsLabelList.length != 0)) {
            _context8.next = 16;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Label is already registered with patient',
            field: 'labelId'
          }));

        case 16:
          _context8.next = 18;
          return regeneratorRuntime.awrap(ClinicPatientModel.findByIdAndUpdate(clinicPatientId, {
            $push: {
              labels: label._id
            }
          }, {
            "new": true
          }));

        case 18:
          updatedClinicPatient = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added label to patient successfully!',
            clinicPatient: updatedClinicPatient
          }));

        case 22:
          _context8.prev = 22;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 26:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var removeClinicPatientLabel = function removeClinicPatientLabel(request, response) {
  var _request$params, clinicPatientId, labelId, clinicPatientsLabelList, updatedClinicPatient;

  return regeneratorRuntime.async(function removeClinicPatientLabel$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _request$params = request.params, clinicPatientId = _request$params.clinicPatientId, labelId = _request$params.labelId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            _id: clinicPatientId,
            labels: {
              $in: [mongoose.Types.ObjectId(labelId)]
            }
          }));

        case 4:
          clinicPatientsLabelList = _context9.sent;

          if (!(clinicPatientsLabelList.length == 0)) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Label is not registered with patient',
            field: 'labelId'
          }));

        case 7:
          _context9.next = 9;
          return regeneratorRuntime.awrap(ClinicPatientModel.findByIdAndUpdate(clinicPatientId, {
            $pull: {
              labels: mongoose.Types.ObjectId(labelId)
            }
          }, {
            "new": true
          }));

        case 9:
          updatedClinicPatient = _context9.sent;
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Removed label from patient successfully!',
            clinicPatient: updatedClinicPatient
          }));

        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var convertDoctorPatientsToClinicPatients = function convertDoctorPatientsToClinicPatients(request, response) {
  var _request$params2, clinicId, userId, clinicPatientsDoctor, clinicPatients, sizes, insertedClinicPatients;

  return regeneratorRuntime.async(function convertDoctorPatientsToClinicPatients$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _request$params2 = request.params, clinicId = _request$params2.clinicId, userId = _request$params2.userId;
          _context10.next = 4;
          return regeneratorRuntime.awrap(ClinicPatientDoctorModel.find({
            clinicId: clinicId,
            doctorId: userId
          }));

        case 4:
          clinicPatientsDoctor = _context10.sent;
          clinicPatients = clinicPatientsDoctor.map(function (patient) {
            var clinicPatient = {
              clinicId: patient.clinicId,
              patientId: patient.patientId,
              createdAt: patient.createdAt
            };
            return clinicPatient;
          });
          sizes = {
            clinicPatientsSize: clinicPatients.length,
            clinicPatientsDoctorSize: clinicPatientsDoctor.length
          };
          console.log(sizes);
          _context10.next = 10;
          return regeneratorRuntime.awrap(ClinicPatientModel.insertMany(clinicPatients));

        case 10:
          insertedClinicPatients = _context10.sent;
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Converted successfully!',
            clinicPatients: insertedClinicPatients
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

module.exports = {
  getClinicsPatients: getClinicsPatients,
  getClinicPatientsByClinicId: getClinicPatientsByClinicId,
  searchClinicsPatients: searchClinicsPatients,
  addClinicPatient: addClinicPatient,
  deleteClinicPatient: deleteClinicPatient,
  addClinicPatientByCardId: addClinicPatientByCardId,
  setClinicPatientSurveyed: setClinicPatientSurveyed,
  addClinicPatientLabel: addClinicPatientLabel,
  removeClinicPatientLabel: removeClinicPatientLabel,
  convertDoctorPatientsToClinicPatients: convertDoctorPatientsToClinicPatients
};