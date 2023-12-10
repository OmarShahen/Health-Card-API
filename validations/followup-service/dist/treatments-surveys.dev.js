"use strict";

var utils = require('../../utils/utils');

var checkListIds = function checkListIds(list) {
  for (var i = 0; i < list.length; i++) {
    if (!utils.isObjectId(list[i])) {
      return false;
    }
  }

  return true;
};

var addTreatmentSurvey = function addTreatmentSurvey(treatmentSurveyData) {
  var doneById = treatmentSurveyData.doneById,
      patientId = treatmentSurveyData.patientId,
      clinicId = treatmentSurveyData.clinicId,
      recordedBy = treatmentSurveyData.recordedBy,
      callDuration = treatmentSurveyData.callDuration,
      improvement = treatmentSurveyData.improvement,
      isOverallHealthChanged = treatmentSurveyData.isOverallHealthChanged,
      isExperiencedSideEffects = treatmentSurveyData.isExperiencedSideEffects,
      experiencedSideEffects = treatmentSurveyData.experiencedSideEffects,
      isMedicationTookAsPrescribed = treatmentSurveyData.isMedicationTookAsPrescribed,
      isDosagesMissed = treatmentSurveyData.isDosagesMissed,
      isTakingOtherOutterMedication = treatmentSurveyData.isTakingOtherOutterMedication,
      isThereChallengesObtainingMedication = treatmentSurveyData.isThereChallengesObtainingMedication,
      challengesObtainingMedication = treatmentSurveyData.challengesObtainingMedication,
      isThereChallengesTakingMedication = treatmentSurveyData.isThereChallengesTakingMedication,
      challengesTakingMedication = treatmentSurveyData.challengesTakingMedication,
      isThereProblemRemebering = treatmentSurveyData.isThereProblemRemebering,
      isNewSymptomsOccured = treatmentSurveyData.isNewSymptomsOccured,
      newSymptomsOccured = treatmentSurveyData.newSymptomsOccured;
  if (!clinicId) return {
    isAccepted: false,
    message: 'Clinic ID is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Invalid clinic ID format',
    field: 'clinicId'
  };
  if (!doneById) return {
    isAccepted: false,
    message: 'Done By ID is required',
    field: 'doneById'
  };
  if (!utils.isObjectId(doneById)) return {
    isAccepted: false,
    message: 'Invalid done by ID format',
    field: 'doneById'
  };
  if (!patientId) return {
    isAccepted: false,
    message: 'Patient ID is required',
    field: 'patientId'
  };
  if (!utils.isObjectId(patientId)) return {
    isAccepted: false,
    message: 'Invalid patient ID format',
    field: 'patientId'
  };
  if (callDuration && typeof callDuration != 'number') return {
    isAccepted: false,
    message: 'Call duration format is invalid',
    field: 'callDuration'
  };
  if (typeof improvement != 'number' || improvement > 5 || improvement < 0) return {
    isAccepted: false,
    message: 'Improvement format is invalid',
    field: 'improvement'
  };
  if (typeof isOverallHealthChanged != 'boolean') return {
    isAccepted: false,
    message: 'Is overall health changed format is invalid',
    field: 'isOverallHealthChanged'
  };
  if (typeof isExperiencedSideEffects != 'boolean') return {
    isAccepted: false,
    message: 'Is experienced side Effects format is invalid',
    field: 'isExperiencedSideEffects'
  };
  if (experiencedSideEffects && !Array.isArray(experiencedSideEffects)) return {
    isAccepted: false,
    message: 'Experienced side effects format is invalid',
    field: 'experiencedSideEffects'
  };
  if (isMedicationTookAsPrescribed && typeof isMedicationTookAsPrescribed != 'boolean') return {
    isAccepted: false,
    message: 'Is medication took as prescribed format is invalid',
    field: 'isMedicationTookAsPrescribed'
  };
  if (isDosagesMissed && typeof isDosagesMissed != 'boolean') return {
    isAccepted: false,
    message: 'Is dosages missed format is invalid',
    field: 'isDosagesMissed'
  };
  if (isTakingOtherOutterMedication && typeof isTakingOtherOutterMedication != 'boolean') return {
    isAccepted: false,
    message: 'Is taking other outter medication format is invalid',
    field: 'isTakingOtherOutterMedication'
  };
  if (isThereChallengesObtainingMedication && typeof isThereChallengesObtainingMedication != 'boolean') return {
    isAccepted: false,
    message: 'Is there challenges obtaining medication format is invalid',
    field: 'isThereChallengesObtainingMedication'
  };
  if (challengesObtainingMedication && !Array.isArray(challengesObtainingMedication)) return {
    isAccepted: false,
    message: 'Challenges obtaining medication format is invalid',
    field: 'challengesObtainingMedication'
  };
  if (challengesObtainingMedication && challengesObtainingMedication.length != 0 && !checkListIds(challengesObtainingMedication)) return {
    isAccepted: false,
    message: 'Challenges obtaining medication value format is invalid',
    field: 'challengesObtainingMedication'
  };
  if (isThereChallengesTakingMedication && typeof isThereChallengesTakingMedication != 'boolean') return {
    isAccepted: false,
    message: 'Is there challenges taking medication format is invalid',
    field: 'isThereChallengesTakingMedication'
  };
  if (challengesTakingMedication && !Array.isArray(challengesTakingMedication)) return {
    isAccepted: false,
    message: 'Challenges taking medication format is invalid',
    field: 'challengesTakingMedication'
  };
  if (challengesTakingMedication && challengesTakingMedication.length != 0 && !checkListIds(challengesTakingMedication)) return {
    isAccepted: false,
    message: 'Challenges taking medication value format is invalid',
    field: 'challengesTakingMedication'
  };
  if (isThereProblemRemebering && typeof isThereProblemRemebering != 'boolean') return {
    isAccepted: false,
    message: 'Is there problem remebering format is invalid',
    field: 'isThereProblemRemebering'
  };
  if (typeof isNewSymptomsOccured != 'boolean') return {
    isAccepted: false,
    message: 'Is new symptoms occured format is invalid',
    field: 'isNewSymptomsOccured'
  };
  if (newSymptomsOccured && !Array.isArray(newSymptomsOccured)) return {
    isAccepted: false,
    message: 'New symptoms occured format is invalid',
    field: 'newSymptomsOccured'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: treatmentSurveyData
  };
};

var updateTreatmentSurvey = function updateTreatmentSurvey(treatmentSurveyData) {
  var callDuration = treatmentSurveyData.callDuration,
      improvement = treatmentSurveyData.improvement,
      isOverallHealthChanged = treatmentSurveyData.isOverallHealthChanged,
      isExperiencedSideEffects = treatmentSurveyData.isExperiencedSideEffects,
      experiencedSideEffects = treatmentSurveyData.experiencedSideEffects,
      isMedicationTookAsPrescribed = treatmentSurveyData.isMedicationTookAsPrescribed,
      isDosagesMissed = treatmentSurveyData.isDosagesMissed,
      isTakingOtherOutterMedication = treatmentSurveyData.isTakingOtherOutterMedication,
      isThereChallengesObtainingMedication = treatmentSurveyData.isThereChallengesObtainingMedication,
      challengesObtainingMedication = treatmentSurveyData.challengesObtainingMedication,
      isThereChallengesTakingMedication = treatmentSurveyData.isThereChallengesTakingMedication,
      challengesTakingMedication = treatmentSurveyData.challengesTakingMedication,
      isThereProblemRemebering = treatmentSurveyData.isThereProblemRemebering,
      isNewSymptomsOccured = treatmentSurveyData.isNewSymptomsOccured,
      newSymptomsOccured = treatmentSurveyData.newSymptomsOccured;
  if (callDuration && typeof callDuration != 'number') return {
    isAccepted: false,
    message: 'Call duration format is invalid',
    field: 'callDuration'
  };
  if (typeof improvement != 'number' || improvement > 5 || improvement < 0) return {
    isAccepted: false,
    message: 'Improvement format is invalid',
    field: 'improvement'
  };
  if (typeof isOverallHealthChanged != 'boolean') return {
    isAccepted: false,
    message: 'Is overall health changed format is invalid',
    field: 'isOverallHealthChanged'
  };
  if (typeof isExperiencedSideEffects != 'boolean') return {
    isAccepted: false,
    message: 'Is experienced side Effects format is invalid',
    field: 'isExperiencedSideEffects'
  };
  if (experiencedSideEffects && !Array.isArray(experiencedSideEffects)) return {
    isAccepted: false,
    message: 'Experienced side effects format is invalid',
    field: 'experiencedSideEffects'
  };
  if (isMedicationTookAsPrescribed && typeof isMedicationTookAsPrescribed != 'boolean') return {
    isAccepted: false,
    message: 'Is medication took as prescribed format is invalid',
    field: 'isMedicationTookAsPrescribed'
  };
  if (isDosagesMissed && typeof isDosagesMissed != 'boolean') return {
    isAccepted: false,
    message: 'Is dosages missed format is invalid',
    field: 'isDosagesMissed'
  };
  if (isTakingOtherOutterMedication && typeof isTakingOtherOutterMedication != 'boolean') return {
    isAccepted: false,
    message: 'Is taking other outter medication format is invalid',
    field: 'isTakingOtherOutterMedication'
  };
  if (isThereChallengesObtainingMedication && typeof isThereChallengesObtainingMedication != 'boolean') return {
    isAccepted: false,
    message: 'Is there challenges obtaining medication format is invalid',
    field: 'isThereChallengesObtainingMedication'
  };
  if (challengesObtainingMedication && !Array.isArray(challengesObtainingMedication)) return {
    isAccepted: false,
    message: 'Challenges obtaining medication format is invalid',
    field: 'challengesObtainingMedication'
  };
  if (challengesObtainingMedication && challengesObtainingMedication.length != 0 && !checkListIds(challengesObtainingMedication)) return {
    isAccepted: false,
    message: 'Challenges obtaining medication value format is invalid',
    field: 'challengesObtainingMedication'
  };
  if (isThereChallengesTakingMedication && typeof isThereChallengesTakingMedication != 'boolean') return {
    isAccepted: false,
    message: 'Is there challenges taking medication format is invalid',
    field: 'isThereChallengesTakingMedication'
  };
  if (challengesTakingMedication && !Array.isArray(challengesTakingMedication)) return {
    isAccepted: false,
    message: 'Challenges taking medication format is invalid',
    field: 'challengesTakingMedication'
  };
  if (challengesTakingMedication && challengesTakingMedication.length != 0 && !checkListIds(challengesTakingMedication)) return {
    isAccepted: false,
    message: 'Challenges taking medication value format is invalid',
    field: 'challengesTakingMedication'
  };
  if (isThereProblemRemebering && typeof isThereProblemRemebering != 'boolean') return {
    isAccepted: false,
    message: 'Is there problem remebering format is invalid',
    field: 'isThereProblemRemebering'
  };
  if (isNewSymptomsOccured && typeof isNewSymptomsOccured != 'boolean') return {
    isAccepted: false,
    message: 'Is new symptoms occured format is invalid',
    field: 'isNewSymptomsOccured'
  };
  if (newSymptomsOccured && !Array.isArray(newSymptomsOccured)) return {
    isAccepted: false,
    message: 'New symptoms occured format is invalid',
    field: 'newSymptomsOccured'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: treatmentSurveyData
  };
};

module.exports = {
  addTreatmentSurvey: addTreatmentSurvey,
  updateTreatmentSurvey: updateTreatmentSurvey
};