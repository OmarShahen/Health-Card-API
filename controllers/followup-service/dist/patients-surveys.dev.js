"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var PatientSurveyModel = require('../../models/followup-service/patientSurveyModel');

var CounterModel = require('../../models/CounterModel');

var UserModel = require('../../models/UserModel');

var PatientModel = require('../../models/PatientModel');

var ClinicModel = require('../../models/ClinicModel');

var ClinicPatientModel = require('../../models/ClinicPatientModel');

var patientValidator = require('../../validations/followup-service/patients-surveys');

var utils = require('../../utils/utils');

var mongoose = require('mongoose');

var getPatientsSurveys = function getPatientsSurveys(request, response) {
  var _utils$statsQueryGene, searchQuery, patientsSurveys;

  return regeneratorRuntime.async(function getPatientsSurveys$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _utils$statsQueryGene = utils.statsQueryGenerator('none', 0, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 4;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
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
          patientsSurveys = _context.sent;
          patientsSurveys.forEach(function (patientSurvey) {
            patientSurvey.patient = patientSurvey.patient[0];
            patientSurvey.member = patientSurvey.member[0];
            patientSurvey.clinic = patientSurvey.clinic[0];
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            patientsSurveys: patientsSurveys
          }));

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var getPatientsSurveysByPatientId = function getPatientsSurveysByPatientId(request, response) {
  var patientId, _utils$statsQueryGene2, searchQuery, patientsSurveys;

  return regeneratorRuntime.async(function getPatientsSurveysByPatientId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          patientId = request.params.patientId;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('patientId', patientId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context2.next = 5;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
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
          patientsSurveys = _context2.sent;
          patientsSurveys.forEach(function (patientSurvey) {
            patientSurvey.patient = patientSurvey.patient[0];
            patientSurvey.member = patientSurvey.member[0];
            patientSurvey.clinic = patientSurvey.clinic[0];
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            patientsSurveys: patientsSurveys
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

var getPatientsSurveysByClinicId = function getPatientsSurveysByClinicId(request, response) {
  var clinicId, _utils$statsQueryGene3, searchQuery, patientsSurveys;

  return regeneratorRuntime.async(function getPatientsSurveysByClinicId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;
          _context3.next = 5;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
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
          patientsSurveys = _context3.sent;
          patientsSurveys.forEach(function (patientSurvey) {
            patientSurvey.patient = patientSurvey.patient[0];
            patientSurvey.member = patientSurvey.member[0];
            patientSurvey.clinic = patientSurvey.clinic[0];
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            patientsSurveys: patientsSurveys
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

var getPatientsSurveysByDoneById = function getPatientsSurveysByDoneById(request, response) {
  var userId, _utils$statsQueryGene4, searchQuery, patientsSurveys;

  return regeneratorRuntime.async(function getPatientsSurveysByDoneById$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene4 = utils.statsQueryGenerator('doneById', userId, request.query), searchQuery = _utils$statsQueryGene4.searchQuery;
          _context4.next = 5;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
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
          patientsSurveys = _context4.sent;
          patientsSurveys.forEach(function (patientSurvey) {
            patientSurvey.patient = patientSurvey.patient[0];
            patientSurvey.member = patientSurvey.member[0];
            patientSurvey.clinic = patientSurvey.clinic[0];
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            patientsSurveys: patientsSurveys
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

var addPatientSurvey = function addPatientSurvey(request, response) {
  var dataValidation, _request$body, doneById, patientId, clinicId, overallExperience, waitingTimeWaited, waitingIsDelayHappened, waitingIsDelayInformed, waitingSatisfaction, environmentIsClean, environmentIsComfortable, staffIsFriendly, staffIsResponsive, healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy, appointmentsIsReminderSent, appointmentsSchedulingWay, memberPromise, patientPromise, clinicPromise, _ref, _ref2, member, patient, clinic, counter, patientSurveyData, patientSurveyObj, newPatientSurvey, clinicPatientList, clinicPatient, updatedClinicPatient, updateClinicPatient;

  return regeneratorRuntime.async(function addPatientSurvey$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          dataValidation = patientValidator.addPatientSurvey(request.body);

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
          _request$body = request.body, doneById = _request$body.doneById, patientId = _request$body.patientId, clinicId = _request$body.clinicId, overallExperience = _request$body.overallExperience, waitingTimeWaited = _request$body.waitingTimeWaited, waitingIsDelayHappened = _request$body.waitingIsDelayHappened, waitingIsDelayInformed = _request$body.waitingIsDelayInformed, waitingSatisfaction = _request$body.waitingSatisfaction, environmentIsClean = _request$body.environmentIsClean, environmentIsComfortable = _request$body.environmentIsComfortable, staffIsFriendly = _request$body.staffIsFriendly, staffIsResponsive = _request$body.staffIsResponsive, healthcareProviderAttentiveness = _request$body.healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately = _request$body.healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation = _request$body.healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked = _request$body.healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound = _request$body.appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy = _request$body.appointmentsIsSchedulingEasy, appointmentsIsReminderSent = _request$body.appointmentsIsReminderSent, appointmentsSchedulingWay = _request$body.appointmentsSchedulingWay;
          memberPromise = UserModel.findById(doneById);
          patientPromise = PatientModel.findById(patientId);
          clinicPromise = ClinicModel.findById(clinicId);
          _context5.next = 10;
          return regeneratorRuntime.awrap(Promise.all([memberPromise, patientPromise, clinicPromise]));

        case 10:
          _ref = _context5.sent;
          _ref2 = _slicedToArray(_ref, 3);
          member = _ref2[0];
          patient = _ref2[1];
          clinic = _ref2[2];

          if (member) {
            _context5.next = 17;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Member ID does not exist',
            field: 'doneById'
          }));

        case 17:
          if (patient) {
            _context5.next = 19;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Patient ID does not exist',
            field: 'patientId'
          }));

        case 19:
          if (clinic) {
            _context5.next = 21;
            break;
          }

          return _context5.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Clinic ID does not exist',
            field: 'clinicId'
          }));

        case 21:
          _context5.next = 23;
          return regeneratorRuntime.awrap(CounterModel.findOneAndUpdate({
            name: 'PatientSurvey'
          }, {
            $inc: {
              value: 1
            }
          }, {
            "new": true,
            upsert: true
          }));

        case 23:
          counter = _context5.sent;
          patientSurveyData = {
            patientSurveyId: counter.value,
            doneById: doneById,
            patientId: patientId,
            clinicId: clinicId,
            overallExperience: overallExperience,
            waiting: {
              timeWaited: waitingTimeWaited,
              isDelayHappened: waitingIsDelayHappened,
              isDelayInformed: waitingIsDelayInformed,
              waitingSatisfaction: waitingSatisfaction
            },
            environment: {
              isClean: environmentIsClean,
              isComfortable: environmentIsComfortable
            },
            staff: {
              isFriendly: staffIsFriendly,
              isResponsive: staffIsResponsive
            },
            healthcareProvider: {
              attentiveness: healthcareProviderAttentiveness,
              isAddressedAdequately: healthcareProviderIsAddressedAdequately,
              treatmentExplanation: healthcareProviderTreatmentExplanation,
              isMedicalHistoryAsked: healthcareProviderIsMedicalHistoryAsked
            },
            appointments: {
              isConvenientTimeSlotFound: appointmentsIsConvenientTimeSlotFound,
              isSchedulingEasy: appointmentsIsSchedulingEasy,
              isReminderSent: appointmentsIsReminderSent,
              schedulingWay: appointmentsSchedulingWay
            }
          };
          patientSurveyObj = new PatientSurveyModel(patientSurveyData);
          _context5.next = 28;
          return regeneratorRuntime.awrap(patientSurveyObj.save());

        case 28:
          newPatientSurvey = _context5.sent;
          _context5.next = 31;
          return regeneratorRuntime.awrap(ClinicPatientModel.find({
            clinicId: clinicId,
            patientId: patientId
          }));

        case 31:
          clinicPatientList = _context5.sent;
          clinicPatient = clinicPatientList[0];
          updatedClinicPatient = {};

          if (clinicPatient.survey.isDone) {
            _context5.next = 39;
            break;
          }

          updateClinicPatient = {
            survey: {
              isDone: true,
              doneById: doneById,
              doneDate: new Date()
            }
          };
          _context5.next = 38;
          return regeneratorRuntime.awrap(ClinicPatientModel.findOneAndUpdate({
            clinicId: clinicId,
            patientId: patientId
          }, updateClinicPatient, {
            "new": true
          }));

        case 38:
          updatedClinicPatient = _context5.sent;

        case 39:
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added patient survey successfully!',
            patientSurvey: newPatientSurvey,
            updatedClinicPatient: updatedClinicPatient
          }));

        case 42:
          _context5.prev = 42;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          return _context5.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context5.t0.message
          }));

        case 46:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 42]]);
};

var updatePatientSurvey = function updatePatientSurvey(request, response) {
  var patientSurveyId, dataValidation, _request$body2, overallExperience, waitingTimeWaited, waitingIsDelayHappened, waitingIsDelayInformed, waitingSatisfaction, environmentIsClean, environmentIsComfortable, staffIsFriendly, staffIsResponsive, healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy, appointmentsIsReminderSent, appointmentsSchedulingWay, patientSurveyData, updatedPatientSurvey;

  return regeneratorRuntime.async(function updatePatientSurvey$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          patientSurveyId = request.params.patientSurveyId;
          dataValidation = patientValidator.updatePatientSurvey(request.body);

          if (dataValidation.isAccepted) {
            _context6.next = 5;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _request$body2 = request.body, overallExperience = _request$body2.overallExperience, waitingTimeWaited = _request$body2.waitingTimeWaited, waitingIsDelayHappened = _request$body2.waitingIsDelayHappened, waitingIsDelayInformed = _request$body2.waitingIsDelayInformed, waitingSatisfaction = _request$body2.waitingSatisfaction, environmentIsClean = _request$body2.environmentIsClean, environmentIsComfortable = _request$body2.environmentIsComfortable, staffIsFriendly = _request$body2.staffIsFriendly, staffIsResponsive = _request$body2.staffIsResponsive, healthcareProviderAttentiveness = _request$body2.healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately = _request$body2.healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation = _request$body2.healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked = _request$body2.healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound = _request$body2.appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy = _request$body2.appointmentsIsSchedulingEasy, appointmentsIsReminderSent = _request$body2.appointmentsIsReminderSent, appointmentsSchedulingWay = _request$body2.appointmentsSchedulingWay;
          patientSurveyData = {
            overallExperience: overallExperience,
            waiting: {
              timeWaited: waitingTimeWaited,
              isDelayHappened: waitingIsDelayHappened,
              isDelayInformed: waitingIsDelayInformed,
              waitingSatisfaction: waitingSatisfaction
            },
            environment: {
              isClean: environmentIsClean,
              isComfortable: environmentIsComfortable
            },
            staff: {
              isFriendly: staffIsFriendly,
              isResponsive: staffIsResponsive
            },
            healthcareProvider: {
              attentiveness: healthcareProviderAttentiveness,
              isAddressedAdequately: healthcareProviderIsAddressedAdequately,
              treatmentExplanation: healthcareProviderTreatmentExplanation,
              isMedicalHistoryAsked: healthcareProviderIsMedicalHistoryAsked
            },
            appointments: {
              isConvenientTimeSlotFound: appointmentsIsConvenientTimeSlotFound,
              isSchedulingEasy: appointmentsIsSchedulingEasy,
              isReminderSent: appointmentsIsReminderSent,
              schedulingWay: appointmentsSchedulingWay
            }
          };
          _context6.next = 9;
          return regeneratorRuntime.awrap(PatientSurveyModel.findByIdAndUpdate(patientSurveyId, patientSurveyData, {
            "new": true
          }));

        case 9:
          updatedPatientSurvey = _context6.sent;
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated patient survey successfully!',
            patientSurvey: updatedPatientSurvey
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

var deletePatientSurvey = function deletePatientSurvey(request, response) {
  var patientSurveyId, deletedPatientSurvey;
  return regeneratorRuntime.async(function deletePatientSurvey$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          patientSurveyId = request.params.patientSurveyId;
          _context7.next = 4;
          return regeneratorRuntime.awrap(PatientSurveyModel.findByIdAndDelete(patientSurveyId));

        case 4:
          deletedPatientSurvey = _context7.sent;
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted patient survey successfully!',
            patientSurvey: deletedPatientSurvey
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

var getPatientSurveyById = function getPatientSurveyById(request, response) {
  var patientSurveyId, patientSurveyList;
  return regeneratorRuntime.async(function getPatientSurveyById$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          patientSurveyId = request.params.patientSurveyId;
          _context8.next = 4;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(patientSurveyId)
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
            $lookup: {
              from: 'users',
              localField: 'doneById',
              foreignField: '_id',
              as: 'member'
            }
          }, {
            $project: {
              'member.password': 0,
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 4:
          patientSurveyList = _context8.sent;
          patientSurveyList.forEach(function (patientSurvey) {
            patientSurvey.patient = patientSurvey.patient[0];
            patientSurvey.clinic = patientSurvey.clinic[0];
            patientSurvey.member = patientSurvey.member[0];
          });
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            patientSurvey: patientSurveyList[0]
          }));

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getPatientsSurveys: getPatientsSurveys,
  getPatientsSurveysByPatientId: getPatientsSurveysByPatientId,
  getPatientsSurveysByClinicId: getPatientsSurveysByClinicId,
  getPatientsSurveysByDoneById: getPatientsSurveysByDoneById,
  getPatientSurveyById: getPatientSurveyById,
  addPatientSurvey: addPatientSurvey,
  deletePatientSurvey: deletePatientSurvey,
  updatePatientSurvey: updatePatientSurvey
};