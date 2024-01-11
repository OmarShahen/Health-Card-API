"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var PatientSurveyModel = require('../../models/followup-service/PatientSurveyModel');

var CallModel = require('../../models/followup-service/CallModel');

var CounterModel = require('../../models/CounterModel');

var UserModel = require('../../models/UserModel');

var PatientModel = require('../../models/PatientModel');

var ArrivalMethodModel = require('../../models/ArrivalMethodModel');

var ClinicModel = require('../../models/ClinicModel');

var ClinicPatientModel = require('../../models/ClinicPatientModel');

var ClinicOwnerModel = require('../../models/ClinicOwnerModel');

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

var getPatientsSurveysByOwnerId = function getPatientsSurveysByOwnerId(request, response) {
  var userId, ownerClinics, clinics, _utils$statsQueryGene4, searchQuery, patientsSurveys;

  return regeneratorRuntime.async(function getPatientsSurveysByOwnerId$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = request.params.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(ClinicOwnerModel.find({
            ownerId: userId
          }));

        case 4:
          ownerClinics = _context4.sent;
          clinics = ownerClinics.map(function (clinic) {
            return clinic.clinicId;
          });
          _utils$statsQueryGene4 = utils.statsQueryGenerator('temp', userId, request.query), searchQuery = _utils$statsQueryGene4.searchQuery;
          delete searchQuery.temp;
          searchQuery.clinicId = {
            $in: clinics
          };
          _context4.next = 11;
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

        case 11:
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

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var getPatientsSurveysByDoneById = function getPatientsSurveysByDoneById(request, response) {
  var userId, _utils$statsQueryGene5, searchQuery, patientsSurveys;

  return regeneratorRuntime.async(function getPatientsSurveysByDoneById$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene5 = utils.statsQueryGenerator('doneById', userId, request.query), searchQuery = _utils$statsQueryGene5.searchQuery;
          _context5.next = 5;
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
          patientsSurveys = _context5.sent;
          patientsSurveys.forEach(function (patientSurvey) {
            patientSurvey.patient = patientSurvey.patient[0];
            patientSurvey.member = patientSurvey.member[0];
            patientSurvey.clinic = patientSurvey.clinic[0];
          });
          return _context5.abrupt("return", response.status(200).json({
            accepted: true,
            patientsSurveys: patientsSurveys
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

var addPatientSurvey = function addPatientSurvey(request, response) {
  var dataValidation, _request$body, doneById, doctorId, reviewerId, overallExperience, comment, serviceIdeaRate, serviceIdeaComment, callDuration, waitingTimeWaited, waitingIsDelayHappened, waitingIsDelayInformed, waitingSatisfaction, environmentIsClean, environmentIsComfortable, staffIsFriendly, staffIsResponsive, healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy, appointmentsIsReminderSent, appointmentsSchedulingWay, memberPromise, reviewerPromise, doctorPromise, _ref, _ref2, member, reviewer, doctor, counter, patientSurveyData, patientSurveyObj, newPatientSurvey, updateDoctor, newCall, _counter, callData, callObj;

  return regeneratorRuntime.async(function addPatientSurvey$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          dataValidation = patientValidator.addPatientSurvey(request.body);

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
          _request$body = request.body, doneById = _request$body.doneById, doctorId = _request$body.doctorId, reviewerId = _request$body.reviewerId, overallExperience = _request$body.overallExperience, comment = _request$body.comment, serviceIdeaRate = _request$body.serviceIdeaRate, serviceIdeaComment = _request$body.serviceIdeaComment, callDuration = _request$body.callDuration, waitingTimeWaited = _request$body.waitingTimeWaited, waitingIsDelayHappened = _request$body.waitingIsDelayHappened, waitingIsDelayInformed = _request$body.waitingIsDelayInformed, waitingSatisfaction = _request$body.waitingSatisfaction, environmentIsClean = _request$body.environmentIsClean, environmentIsComfortable = _request$body.environmentIsComfortable, staffIsFriendly = _request$body.staffIsFriendly, staffIsResponsive = _request$body.staffIsResponsive, healthcareProviderAttentiveness = _request$body.healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately = _request$body.healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation = _request$body.healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked = _request$body.healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound = _request$body.appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy = _request$body.appointmentsIsSchedulingEasy, appointmentsIsReminderSent = _request$body.appointmentsIsReminderSent, appointmentsSchedulingWay = _request$body.appointmentsSchedulingWay;
          memberPromise = UserModel.findById(doneById);
          reviewerPromise = UserModel.findById(reviewerId);
          doctorPromise = UserModel.findById(doctorId);
          _context6.next = 10;
          return regeneratorRuntime.awrap(Promise.all([memberPromise, reviewerPromise, doctorPromise]));

        case 10:
          _ref = _context6.sent;
          _ref2 = _slicedToArray(_ref, 3);
          member = _ref2[0];
          reviewer = _ref2[1];
          doctor = _ref2[2];

          if (member) {
            _context6.next = 17;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Member ID does not exist',
            field: 'doneById'
          }));

        case 17:
          if (reviewer) {
            _context6.next = 19;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Reviewer ID does not exist',
            field: 'reviewerId'
          }));

        case 19:
          if (doctor) {
            _context6.next = 21;
            break;
          }

          return _context6.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Doctor ID does not exist',
            field: 'doctorId'
          }));

        case 21:
          _context6.next = 23;
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
          counter = _context6.sent;
          patientSurveyData = {
            patientSurveyId: counter.value,
            doneById: doneById,
            reviewerId: reviewerId,
            doctorId: doctorId,
            overallExperience: overallExperience,
            comment: comment,
            serviceIdeaRate: serviceIdeaRate,
            serviceIdeaComment: serviceIdeaComment,
            callDuration: callDuration,
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
          _context6.next = 28;
          return regeneratorRuntime.awrap(patientSurveyObj.save());

        case 28:
          newPatientSurvey = _context6.sent;
          _context6.next = 31;
          return regeneratorRuntime.awrap(UserModel.findByIdAndUpdate(doctorId, {
            totalReviews: doctor.totalReviews + 1
          }, {
            "new": true
          }));

        case 31:
          updateDoctor = _context6.sent;
          newCall = {};

          if (!callDuration) {
            _context6.next = 42;
            break;
          }

          _context6.next = 36;
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

        case 36:
          _counter = _context6.sent;
          callData = {
            callId: _counter.value,
            patientId: reviewerId,
            doctorId: doctorId,
            doneById: doneById,
            patientSurveyId: newPatientSurvey._id,
            duration: callDuration
          };
          callObj = new CallModel(callData);
          _context6.next = 41;
          return regeneratorRuntime.awrap(callObj.save());

        case 41:
          newCall = _context6.sent;

        case 42:
          return _context6.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Added patient survey successfully!',
            patientSurvey: newPatientSurvey,
            call: newCall,
            doctor: updateDoctor
          }));

        case 45:
          _context6.prev = 45;
          _context6.t0 = _context6["catch"](0);
          console.error(_context6.t0);
          return _context6.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context6.t0.message
          }));

        case 49:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 45]]);
};

var getPatientsSurveysByDoctorId = function getPatientsSurveysByDoctorId(request, response) {
  var userId, _utils$statsQueryGene6, searchQuery, patientsSurveys;

  return regeneratorRuntime.async(function getPatientsSurveysByDoctorId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          userId = request.params.userId;
          _utils$statsQueryGene6 = utils.statsQueryGenerator('doctorId', userId, request.query), searchQuery = _utils$statsQueryGene6.searchQuery;
          _context7.next = 5;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $sort: {
              createdAt: -1
            }
          }, {
            $limit: 25
          }, {
            $lookup: {
              from: 'users',
              localField: 'reviewerId',
              foreignField: '_id',
              as: 'reviewer'
            }
          }, {
            $project: {
              'reviewer.password': 0
            }
          }]));

        case 5:
          patientsSurveys = _context7.sent;
          patientsSurveys.forEach(function (patientSurvey) {
            patientSurvey.reviewer = patientSurvey.reviewer[0];
          });
          return _context7.abrupt("return", response.status(200).json({
            accepted: true,
            patientsSurveys: patientsSurveys
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

var updatePatientSurvey = function updatePatientSurvey(request, response) {
  var patientSurveyId, dataValidation, _request$body2, arrivalMethodId, overallExperience, serviceIdeaRate, serviceIdeaComment, callDuration, waitingTimeWaited, waitingIsDelayHappened, waitingIsDelayInformed, waitingSatisfaction, environmentIsClean, environmentIsComfortable, staffIsFriendly, staffIsResponsive, healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy, appointmentsIsReminderSent, appointmentsSchedulingWay, arrivalMethod, patientSurveyData, updatedPatientSurvey;

  return regeneratorRuntime.async(function updatePatientSurvey$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          patientSurveyId = request.params.patientSurveyId;
          dataValidation = patientValidator.updatePatientSurvey(request.body);

          if (dataValidation.isAccepted) {
            _context8.next = 5;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: dataValidation.isAccepted,
            message: dataValidation.message,
            field: dataValidation.field
          }));

        case 5:
          _request$body2 = request.body, arrivalMethodId = _request$body2.arrivalMethodId, overallExperience = _request$body2.overallExperience, serviceIdeaRate = _request$body2.serviceIdeaRate, serviceIdeaComment = _request$body2.serviceIdeaComment, callDuration = _request$body2.callDuration, waitingTimeWaited = _request$body2.waitingTimeWaited, waitingIsDelayHappened = _request$body2.waitingIsDelayHappened, waitingIsDelayInformed = _request$body2.waitingIsDelayInformed, waitingSatisfaction = _request$body2.waitingSatisfaction, environmentIsClean = _request$body2.environmentIsClean, environmentIsComfortable = _request$body2.environmentIsComfortable, staffIsFriendly = _request$body2.staffIsFriendly, staffIsResponsive = _request$body2.staffIsResponsive, healthcareProviderAttentiveness = _request$body2.healthcareProviderAttentiveness, healthcareProviderIsAddressedAdequately = _request$body2.healthcareProviderIsAddressedAdequately, healthcareProviderTreatmentExplanation = _request$body2.healthcareProviderTreatmentExplanation, healthcareProviderIsMedicalHistoryAsked = _request$body2.healthcareProviderIsMedicalHistoryAsked, appointmentsIsConvenientTimeSlotFound = _request$body2.appointmentsIsConvenientTimeSlotFound, appointmentsIsSchedulingEasy = _request$body2.appointmentsIsSchedulingEasy, appointmentsIsReminderSent = _request$body2.appointmentsIsReminderSent, appointmentsSchedulingWay = _request$body2.appointmentsSchedulingWay;

          if (!arrivalMethodId) {
            _context8.next = 12;
            break;
          }

          _context8.next = 9;
          return regeneratorRuntime.awrap(ArrivalMethodModel.findById(arrivalMethodId));

        case 9:
          arrivalMethod = _context8.sent;

          if (arrivalMethod) {
            _context8.next = 12;
            break;
          }

          return _context8.abrupt("return", response.status(400).json({
            accepted: false,
            message: 'Arrival method ID does not exist',
            field: 'arrivalMethodId'
          }));

        case 12:
          patientSurveyData = {
            arrivalMethodId: arrivalMethodId,
            overallExperience: overallExperience,
            serviceIdeaRate: serviceIdeaRate,
            serviceIdeaComment: serviceIdeaComment,
            callDuration: callDuration,
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
          _context8.next = 15;
          return regeneratorRuntime.awrap(PatientSurveyModel.findByIdAndUpdate(patientSurveyId, patientSurveyData, {
            "new": true
          }));

        case 15:
          updatedPatientSurvey = _context8.sent;
          return _context8.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Updated patient survey successfully!',
            patientSurvey: updatedPatientSurvey
          }));

        case 19:
          _context8.prev = 19;
          _context8.t0 = _context8["catch"](0);
          console.error(_context8.t0);
          return _context8.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context8.t0.message
          }));

        case 23:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var deletePatientSurvey = function deletePatientSurvey(request, response) {
  var patientSurveyId, deletedPatientSurvey, clinicId, patientId, patientsSurveysList, updatedClinicPatient, updateClinicPatientData;
  return regeneratorRuntime.async(function deletePatientSurvey$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          patientSurveyId = request.params.patientSurveyId;
          _context9.next = 4;
          return regeneratorRuntime.awrap(PatientSurveyModel.findByIdAndDelete(patientSurveyId));

        case 4:
          deletedPatientSurvey = _context9.sent;
          clinicId = deletedPatientSurvey.clinicId, patientId = deletedPatientSurvey.patientId;
          _context9.next = 8;
          return regeneratorRuntime.awrap(PatientSurveyModel.find({
            patientId: patientId
          }));

        case 8:
          patientsSurveysList = _context9.sent;
          updatedClinicPatient = {};

          if (!(patientsSurveysList.length == 0)) {
            _context9.next = 15;
            break;
          }

          updateClinicPatientData = {
            survey: {
              isDone: false,
              doneById: null,
              doneDate: null
            }
          };
          _context9.next = 14;
          return regeneratorRuntime.awrap(ClinicPatientModel.findOneAndUpdate({
            clinicId: clinicId,
            patientId: patientId
          }, updateClinicPatientData, {
            "new": true
          }));

        case 14:
          updatedClinicPatient = _context9.sent;

        case 15:
          return _context9.abrupt("return", response.status(200).json({
            accepted: true,
            message: 'Deleted patient survey successfully!',
            patientSurvey: deletedPatientSurvey,
            clinicPatient: updatedClinicPatient
          }));

        case 18:
          _context9.prev = 18;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          return _context9.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context9.t0.message
          }));

        case 22:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var getPatientSurveyById = function getPatientSurveyById(request, response) {
  var patientSurveyId, patientSurveyList;
  return regeneratorRuntime.async(function getPatientSurveyById$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          patientSurveyId = request.params.patientSurveyId;
          _context10.next = 4;
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
            $lookup: {
              from: 'arrivalmethods',
              localField: 'arrivalMethodId',
              foreignField: '_id',
              as: 'arrivalMethod'
            }
          }, {
            $project: {
              'member.password': 0,
              'patient.healthHistory': 0,
              'patient.emergencyContacts': 0
            }
          }]));

        case 4:
          patientSurveyList = _context10.sent;
          patientSurveyList.forEach(function (patientSurvey) {
            patientSurvey.patient = patientSurvey.patient[0];
            patientSurvey.clinic = patientSurvey.clinic[0];
            patientSurvey.member = patientSurvey.member[0];
            patientSurvey.arrivalMethod = patientSurvey.arrivalMethod[0];
          });
          return _context10.abrupt("return", response.status(200).json({
            accepted: true,
            patientSurvey: patientSurveyList[0]
          }));

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          return _context10.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context10.t0.message
          }));

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getPatientsSurveys: getPatientsSurveys,
  getPatientsSurveysByPatientId: getPatientsSurveysByPatientId,
  getPatientsSurveysByClinicId: getPatientsSurveysByClinicId,
  getPatientsSurveysByOwnerId: getPatientsSurveysByOwnerId,
  getPatientsSurveysByDoneById: getPatientsSurveysByDoneById,
  getPatientSurveyById: getPatientSurveyById,
  getPatientsSurveysByDoctorId: getPatientsSurveysByDoctorId,
  addPatientSurvey: addPatientSurvey,
  deletePatientSurvey: deletePatientSurvey,
  updatePatientSurvey: updatePatientSurvey
};