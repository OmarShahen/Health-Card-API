"use strict";

var ClinicPatientModel = require('../models/ClinicPatientModel');

var TreatmentSurveyModel = require('../models/followup-service/TreatmentSurveyModel');

var PatientSurveyModel = require('../models/followup-service/PatientSurveyModel');

var CallModel = require('../models/followup-service/CallModel');

var utils = require('../utils/utils');

var mongoose = require('mongoose');

var getOverviewAnalytics = function getOverviewAnalytics(request, response) {
  var clinicId, _utils$statsQueryGene, searchQuery, totalClinicPatients, totalTreatmentsSurveys, totalPatientsSurveys, totalCalls, totalSurveys, clinicPatientsGrowth, patientsSurveysOverallExperienceScores, treatmentsSurveysImprovementScores;

  return regeneratorRuntime.async(function getOverviewAnalytics$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene.searchQuery;
          _context.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.countDocuments(searchQuery));

        case 5:
          totalClinicPatients = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.countDocuments(searchQuery));

        case 8:
          totalTreatmentsSurveys = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(PatientSurveyModel.countDocuments(searchQuery));

        case 11:
          totalPatientsSurveys = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(CallModel.countDocuments(searchQuery));

        case 14:
          totalCalls = _context.sent;
          totalSurveys = totalTreatmentsSurveys + totalPatientsSurveys;
          _context.next = 18;
          return regeneratorRuntime.awrap(ClinicPatientModel.aggregate([{
            $match: {
              clinicId: mongoose.Types.ObjectId(clinicId)
            }
          }, {
            $group: {
              _id: {
                $dateToString: {
                  format: '%Y-%m',
                  date: '$createdAt'
                }
              },
              count: {
                $sum: 1
              }
            }
          }]));

        case 18:
          clinicPatientsGrowth = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$overallExperience',
              count: {
                $sum: 1
              }
            }
          }]));

        case 21:
          patientsSurveysOverallExperienceScores = _context.sent;
          _context.next = 24;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$improvement',
              count: {
                $sum: 1
              }
            }
          }]));

        case 24:
          treatmentsSurveysImprovementScores = _context.sent;
          clinicPatientsGrowth.sort(function (month1, month2) {
            return new Date(month1._id) - new Date(month2._id);
          });
          patientsSurveysOverallExperienceScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysImprovementScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          return _context.abrupt("return", response.status(200).json({
            accepted: true,
            totalClinicPatients: totalClinicPatients,
            totalTreatmentsSurveys: totalTreatmentsSurveys,
            totalPatientsSurveys: totalPatientsSurveys,
            totalCalls: totalCalls,
            totalSurveys: totalSurveys,
            treatmentsSurveysImprovementScores: treatmentsSurveysImprovementScores,
            patientsSurveysOverallExperienceScores: patientsSurveysOverallExperienceScores,
            clinicPatientsGrowth: clinicPatientsGrowth
          }));

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          return _context.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context.t0.message
          }));

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

var getImpressionsAnalytics = function getImpressionsAnalytics(request, response) {
  var clinicId, _utils$statsQueryGene2, searchQuery, totalClinicPatients, totalPatientsSurveys, patientsSurveysOverallExperienceScores, patientsSurveysCleanScores, patientsSurveysComfortableScores, patientsSurveysStaffFriendlyScores, patientsSurveysStaffResponsiveScores, patientsSurveysWaitingSatisfactionScores, patientsSurveysWaitingDelayHappenScores, patientsSurveysWaitingDelayInformedScores, patientsSurveysDoctorAttentionScores, patientsSurveysSymptomsAddressedScores, patientsSurveysTreatmentExplanationScores, patientsSurveysMedicalHistoryScores, patientsSurveysTimeSlotScores, patientsSurveysSchedulingEaseScores, patientsSurveysRemindersSentScores, patientsSurveysSchedulingWayScores;

  return regeneratorRuntime.async(function getImpressionsAnalytics$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene2 = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene2.searchQuery;
          _context2.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.countDocuments(searchQuery));

        case 5:
          totalClinicPatients = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(PatientSurveyModel.countDocuments(searchQuery));

        case 8:
          totalPatientsSurveys = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$overallExperience',
              count: {
                $sum: 1
              }
            }
          }]));

        case 11:
          patientsSurveysOverallExperienceScores = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$environment.isClean',
              count: {
                $sum: 1
              }
            }
          }]));

        case 14:
          patientsSurveysCleanScores = _context2.sent;
          _context2.next = 17;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$environment.isComfortable',
              count: {
                $sum: 1
              }
            }
          }]));

        case 17:
          patientsSurveysComfortableScores = _context2.sent;
          _context2.next = 20;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$staff.isFriendly',
              count: {
                $sum: 1
              }
            }
          }]));

        case 20:
          patientsSurveysStaffFriendlyScores = _context2.sent;
          _context2.next = 23;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$staff.isResponsive',
              count: {
                $sum: 1
              }
            }
          }]));

        case 23:
          patientsSurveysStaffResponsiveScores = _context2.sent;
          _context2.next = 26;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$waiting.waitingSatisfaction',
              count: {
                $sum: 1
              }
            }
          }]));

        case 26:
          patientsSurveysWaitingSatisfactionScores = _context2.sent;
          _context2.next = 29;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$waiting.isDelayHappened',
              count: {
                $sum: 1
              }
            }
          }]));

        case 29:
          patientsSurveysWaitingDelayHappenScores = _context2.sent;
          _context2.next = 32;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$waiting.isDelayInformed',
              count: {
                $sum: 1
              }
            }
          }]));

        case 32:
          patientsSurveysWaitingDelayInformedScores = _context2.sent;
          _context2.next = 35;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$healthcareProvider.attentiveness',
              count: {
                $sum: 1
              }
            }
          }]));

        case 35:
          patientsSurveysDoctorAttentionScores = _context2.sent;
          _context2.next = 38;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$healthcareProvider.isAddressedAdequately',
              count: {
                $sum: 1
              }
            }
          }]));

        case 38:
          patientsSurveysSymptomsAddressedScores = _context2.sent;
          _context2.next = 41;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$healthcareProvider.treatmentExplanation',
              count: {
                $sum: 1
              }
            }
          }]));

        case 41:
          patientsSurveysTreatmentExplanationScores = _context2.sent;
          _context2.next = 44;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$healthcareProvider.isMedicalHistoryAsked',
              count: {
                $sum: 1
              }
            }
          }]));

        case 44:
          patientsSurveysMedicalHistoryScores = _context2.sent;
          _context2.next = 47;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$appointments.isConvenientTimeSlotFound',
              count: {
                $sum: 1
              }
            }
          }]));

        case 47:
          patientsSurveysTimeSlotScores = _context2.sent;
          _context2.next = 50;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$appointments.isSchedulingEasy',
              count: {
                $sum: 1
              }
            }
          }]));

        case 50:
          patientsSurveysSchedulingEaseScores = _context2.sent;
          _context2.next = 53;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$appointments.isReminderSent',
              count: {
                $sum: 1
              }
            }
          }]));

        case 53:
          patientsSurveysRemindersSentScores = _context2.sent;
          _context2.next = 56;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$appointments.schedulingWay',
              count: {
                $sum: 1
              }
            }
          }]));

        case 56:
          patientsSurveysSchedulingWayScores = _context2.sent;
          patientsSurveysOverallExperienceScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysCleanScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysComfortableScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysStaffFriendlyScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysStaffResponsiveScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysWaitingSatisfactionScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysWaitingDelayHappenScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysWaitingDelayInformedScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysDoctorAttentionScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysSymptomsAddressedScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysTreatmentExplanationScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysMedicalHistoryScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysTimeSlotScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysSchedulingEaseScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysRemindersSentScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          patientsSurveysSchedulingWayScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          return _context2.abrupt("return", response.status(200).json({
            accepted: true,
            totalClinicPatients: totalClinicPatients,
            totalPatientsSurveys: totalPatientsSurveys,
            patientsSurveysSchedulingWayScores: patientsSurveysSchedulingWayScores,
            patientsSurveysRemindersSentScores: patientsSurveysRemindersSentScores,
            patientsSurveysSchedulingEaseScores: patientsSurveysSchedulingEaseScores,
            patientsSurveysTimeSlotScores: patientsSurveysTimeSlotScores,
            patientsSurveysDoctorAttentionScores: patientsSurveysDoctorAttentionScores,
            patientsSurveysSymptomsAddressedScores: patientsSurveysSymptomsAddressedScores,
            patientsSurveysTreatmentExplanationScores: patientsSurveysTreatmentExplanationScores,
            patientsSurveysMedicalHistoryScores: patientsSurveysMedicalHistoryScores,
            patientsSurveysWaitingSatisfactionScores: patientsSurveysWaitingSatisfactionScores,
            patientsSurveysWaitingDelayHappenScores: patientsSurveysWaitingDelayHappenScores,
            patientsSurveysWaitingDelayInformedScores: patientsSurveysWaitingDelayInformedScores,
            patientsSurveysStaffResponsiveScores: patientsSurveysStaffResponsiveScores,
            patientsSurveysStaffFriendlyScores: patientsSurveysStaffFriendlyScores,
            patientsSurveysComfortableScores: patientsSurveysComfortableScores,
            patientsSurveysCleanScores: patientsSurveysCleanScores,
            patientsSurveysOverallExperienceScores: patientsSurveysOverallExperienceScores
          }));

        case 76:
          _context2.prev = 76;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", response.status(500).json({
            accepted: false,
            messahe: 'internal server error',
            error: _context2.t0.message
          }));

        case 80:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 76]]);
};

var getTreatmentsAnalytics = function getTreatmentsAnalytics(request, response) {
  var clinicId, _utils$statsQueryGene3, searchQuery, totalClinicPatients, totalTreatmentSurveys, treatmentsSurveysImprovementScores, treatmentsSurveysOverallHealthScores, treatmentsSurveysExperiencedSideEffectsScores, treatmentsSurveysNewSymptomsOccuredScores, treatmentsSurveysMedicationTookAsPrescribedScores, treatmentsSurveysDosageMissedScores, treatmentsSurveysObtainingMedicationScores, treatmentsSurveysTakingMedicationScores, treatmentsSurveysTakingOutterMedicationScores, treatmentsSurveysProblemRemeberingScores;

  return regeneratorRuntime.async(function getTreatmentsAnalytics$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene3 = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene3.searchQuery;
          _context3.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.countDocuments(searchQuery));

        case 5:
          totalClinicPatients = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.countDocuments(searchQuery));

        case 8:
          totalTreatmentSurveys = _context3.sent;
          _context3.next = 11;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$improvement',
              count: {
                $sum: 1
              }
            }
          }]));

        case 11:
          treatmentsSurveysImprovementScores = _context3.sent;
          _context3.next = 14;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isOverallHealthChanged',
              count: {
                $sum: 1
              }
            }
          }]));

        case 14:
          treatmentsSurveysOverallHealthScores = _context3.sent;
          _context3.next = 17;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isExperiencedSideEffects',
              count: {
                $sum: 1
              }
            }
          }]));

        case 17:
          treatmentsSurveysExperiencedSideEffectsScores = _context3.sent;
          _context3.next = 20;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isNewSymptomsOccured',
              count: {
                $sum: 1
              }
            }
          }]));

        case 20:
          treatmentsSurveysNewSymptomsOccuredScores = _context3.sent;
          _context3.next = 23;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isMedicationTookAsPrescribed',
              count: {
                $sum: 1
              }
            }
          }]));

        case 23:
          treatmentsSurveysMedicationTookAsPrescribedScores = _context3.sent;
          _context3.next = 26;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isDosagesMissed',
              count: {
                $sum: 1
              }
            }
          }]));

        case 26:
          treatmentsSurveysDosageMissedScores = _context3.sent;
          _context3.next = 29;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isThereChallengesObtainingMedication',
              count: {
                $sum: 1
              }
            }
          }]));

        case 29:
          treatmentsSurveysObtainingMedicationScores = _context3.sent;
          _context3.next = 32;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isThereChallengesTakingMedication',
              count: {
                $sum: 1
              }
            }
          }]));

        case 32:
          treatmentsSurveysTakingMedicationScores = _context3.sent;
          _context3.next = 35;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isTakingOtherOutterMedication',
              count: {
                $sum: 1
              }
            }
          }]));

        case 35:
          treatmentsSurveysTakingOutterMedicationScores = _context3.sent;
          _context3.next = 38;
          return regeneratorRuntime.awrap(TreatmentSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$isThereProblemRemebering',
              count: {
                $sum: 1
              }
            }
          }]));

        case 38:
          treatmentsSurveysProblemRemeberingScores = _context3.sent;
          treatmentsSurveysImprovementScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysOverallHealthScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysExperiencedSideEffectsScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysNewSymptomsOccuredScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysMedicationTookAsPrescribedScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysDosageMissedScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysObtainingMedicationScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysTakingMedicationScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysTakingOutterMedicationScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          treatmentsSurveysProblemRemeberingScores.sort(function (score1, score2) {
            return score2._id - score1._id;
          });
          return _context3.abrupt("return", response.status(200).json({
            accepted: true,
            totalClinicPatients: totalClinicPatients,
            totalTreatmentSurveys: totalTreatmentSurveys,
            treatmentsSurveysTakingOutterMedicationScores: treatmentsSurveysTakingOutterMedicationScores,
            treatmentsSurveysProblemRemeberingScores: treatmentsSurveysProblemRemeberingScores,
            treatmentsSurveysObtainingMedicationScores: treatmentsSurveysObtainingMedicationScores,
            treatmentsSurveysTakingMedicationScores: treatmentsSurveysTakingMedicationScores,
            treatmentsSurveysMedicationTookAsPrescribedScores: treatmentsSurveysMedicationTookAsPrescribedScores,
            treatmentsSurveysDosageMissedScores: treatmentsSurveysDosageMissedScores,
            treatmentsSurveysExperiencedSideEffectsScores: treatmentsSurveysExperiencedSideEffectsScores,
            treatmentsSurveysNewSymptomsOccuredScores: treatmentsSurveysNewSymptomsOccuredScores,
            treatmentsSurveysOverallHealthScores: treatmentsSurveysOverallHealthScores,
            treatmentsSurveysImprovementScores: treatmentsSurveysImprovementScores
          }));

        case 52:
          _context3.prev = 52;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          return _context3.abrupt("return", response.status(500).json({
            accepted: false,
            messahe: 'internal server error',
            error: _context3.t0.message
          }));

        case 56:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 52]]);
};

var getMarketingAnalytics = function getMarketingAnalytics(request, response) {
  var clinicId, _utils$statsQueryGene4, searchQuery, totalClinicPatients, totalPatientsSurveys, patientsGenderScore, patientsAgeScore, patientsCitiesScore, patientsSocialStatusScore, patientsSurveysSchedulingWayScores, patientsArrivingMethods;

  return regeneratorRuntime.async(function getMarketingAnalytics$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          clinicId = request.params.clinicId;
          _utils$statsQueryGene4 = utils.statsQueryGenerator('clinicId', clinicId, request.query), searchQuery = _utils$statsQueryGene4.searchQuery;
          _context4.next = 5;
          return regeneratorRuntime.awrap(ClinicPatientModel.countDocuments(searchQuery));

        case 5:
          totalClinicPatients = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(PatientSurveyModel.countDocuments(searchQuery));

        case 8:
          totalPatientsSurveys = _context4.sent;
          _context4.next = 11;
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
            $unwind: '$patient'
          }, {
            $group: {
              _id: '$patient.gender',
              count: {
                $sum: 1
              }
            }
          }]));

        case 11:
          patientsGenderScore = _context4.sent;
          _context4.next = 14;
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
            $unwind: '$patient'
          }, {
            $group: {
              _id: '$patient.dateOfBirth',
              count: {
                $sum: 1
              }
            }
          }]));

        case 14:
          patientsAgeScore = _context4.sent;
          _context4.next = 17;
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
            $unwind: '$patient'
          }, {
            $group: {
              _id: '$patient.city',
              count: {
                $sum: 1
              }
            }
          }]));

        case 17:
          patientsCitiesScore = _context4.sent;
          _context4.next = 20;
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
            $unwind: '$patient'
          }, {
            $group: {
              _id: '$patient.socialStatus',
              count: {
                $sum: 1
              }
            }
          }]));

        case 20:
          patientsSocialStatusScore = _context4.sent;
          _context4.next = 23;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$appointments.schedulingWay',
              count: {
                $sum: 1
              }
            }
          }]));

        case 23:
          patientsSurveysSchedulingWayScores = _context4.sent;
          _context4.next = 26;
          return regeneratorRuntime.awrap(PatientSurveyModel.aggregate([{
            $match: searchQuery
          }, {
            $group: {
              _id: '$arrivalMethodId',
              count: {
                $sum: 1
              }
            }
          }, {
            $lookup: {
              from: 'arrivalmethods',
              localField: '_id',
              foreignField: '_id',
              as: 'arrivalMethod'
            }
          }, {
            $unwind: '$arrivalMethod'
          }]));

        case 26:
          patientsArrivingMethods = _context4.sent;
          patientsAgeScore.forEach(function (dateOfBirth) {
            return dateOfBirth._id = utils.getAge(dateOfBirth._id);
          });
          patientsGenderScore.sort(function (score1, score2) {
            return score2.count - score1.count;
          });
          patientsAgeScore.sort(function (score1, score2) {
            return score2.count - score1.count;
          });
          patientsCitiesScore.sort(function (score1, score2) {
            return score2.count - score1.count;
          });
          patientsSocialStatusScore.sort(function (score1, score2) {
            return score2.count - score1.count;
          });
          patientsSurveysSchedulingWayScores.sort(function (score1, score2) {
            return score2.count - score1.count;
          });
          patientsArrivingMethods.sort(function (score1, score2) {
            return score2.count - score1.count;
          });
          patientsArrivingMethods.forEach(function (method) {
            return method._id = method.arrivalMethod.name;
          });
          return _context4.abrupt("return", response.status(200).json({
            accepted: true,
            totalClinicPatients: totalClinicPatients,
            totalPatientsSurveys: totalPatientsSurveys,
            patientsArrivingMethods: patientsArrivingMethods,
            patientsSurveysSchedulingWayScores: patientsSurveysSchedulingWayScores,
            patientsAgeScore: patientsAgeScore,
            patientsSocialStatusScore: patientsSocialStatusScore,
            patientsCitiesScore: patientsCitiesScore,
            patientsGenderScore: patientsGenderScore
          }));

        case 38:
          _context4.prev = 38;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          return _context4.abrupt("return", response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: _context4.t0.message
          }));

        case 42:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 38]]);
};

module.exports = {
  getOverviewAnalytics: getOverviewAnalytics,
  getImpressionsAnalytics: getImpressionsAnalytics,
  getTreatmentsAnalytics: getTreatmentsAnalytics,
  getMarketingAnalytics: getMarketingAnalytics
};