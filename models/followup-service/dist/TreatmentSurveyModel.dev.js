"use strict";

var mongoose = require('mongoose');

var TreatmentSurveySchema = new mongoose.Schema({
  treatmentSurveyId: {
    type: Number,
    required: true
  },
  doneById: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  recordedBy: {
    type: String,
    "default": 'CALL'
  },
  callDuration: {
    type: Number
  },
  improvement: {
    type: Number,
    required: true
  },
  isOverallHealthChanged: {
    type: Boolean,
    required: true
  },
  isExperiencedSideEffects: {
    type: Boolean,
    required: true
  },
  experiencedSideEffects: [],
  isMedicationTookAsPrescribed: {
    type: Boolean
  },
  isDosagesMissed: {
    type: Boolean
  },
  isTakingOtherOutterMedication: {
    type: Boolean
  },
  isThereChallengesObtainingMedication: {
    type: Boolean
  },
  challengesObtainingMedication: [],
  isThereChallengesTakingMedication: {
    type: Boolean
  },
  challengesTakingMedication: [],
  isThereProblemRemebering: {
    type: Boolean
  },
  isNewSymptomsOccured: {
    type: Boolean,
    required: true
  },
  newSymptomsOccured: []
}, {
  timestamps: true
});
module.exports = mongoose.model('TreatmentSurvey', TreatmentSurveySchema);