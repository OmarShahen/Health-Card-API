"use strict";

var utils = require('../../utils/utils');

var config = require('../../config/config');

var addPatientSurvey = function addPatientSurvey(patientSurveyData) {
  var doneById = patientSurveyData.doneById,
      patientId = patientSurveyData.patientId,
      clinicId = patientSurveyData.clinicId,
      overallExperience = patientSurveyData.overallExperience,
      callDuration = patientSurveyData.callDuration,
      waitingTimeWaited = patientSurveyData.waitingTimeWaited,
      waitingIsDelayHappened = patientSurveyData.waitingIsDelayHappened,
      waitingIsDelayInformed = patientSurveyData.waitingIsDelayInformed,
      waitingSatisfaction = patientSurveyData.waitingSatisfaction,
      environmentIsClean = patientSurveyData.environmentIsClean,
      environmentIsComfortable = patientSurveyData.environmentIsComfortable,
      staffIsFriendly = patientSurveyData.staffIsFriendly,
      staffIsResponsive = patientSurveyData.staffIsResponsive,
      healthcareProviderAttentiveness = patientSurveyData.healthcareProviderAttentiveness,
      healthcareProviderIsAddressedAdequately = patientSurveyData.healthcareProviderIsAddressedAdequately,
      healthcareProviderTreatmentExplanation = patientSurveyData.healthcareProviderTreatmentExplanation,
      healthcareProviderIsMedicalHistoryAsked = patientSurveyData.healthcareProviderIsMedicalHistoryAsked,
      appointmentsIsConvenientTimeSlotFound = patientSurveyData.appointmentsIsConvenientTimeSlotFound,
      appointmentsIsSchedulingEasy = patientSurveyData.appointmentsIsSchedulingEasy,
      appointmentsIsReminderSent = patientSurveyData.appointmentsIsReminderSent,
      appointmentsSchedulingWay = patientSurveyData.appointmentsSchedulingWay;
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
  if (typeof overallExperience != 'number') return {
    isAccepted: false,
    message: 'Overall experience format is invalid',
    field: 'overallExperience'
  };
  if (callDuration && typeof callDuration != 'number') return {
    isAccepted: false,
    message: 'Call duration format is invalid',
    field: 'callDuration'
  };
  if (typeof waitingTimeWaited != 'number') return {
    isAccepted: false,
    message: 'waiting time format is invalid',
    field: 'waitingTimeWaited'
  };
  if (typeof waitingIsDelayHappened != 'boolean') return {
    isAccepted: false,
    message: 'waiting is delayed happened format is invalid',
    field: 'waitingIsDelayHappened'
  };
  if (typeof waitingIsDelayInformed != 'boolean') return {
    isAccepted: false,
    message: 'waiting is delay informed format is invalid',
    field: 'waitingIsDelayInformed'
  };
  if (typeof waitingSatisfaction != 'number') return {
    isAccepted: false,
    message: 'waiting satisfaction format is invalid',
    field: 'waitingSatisfaction'
  };
  if (typeof environmentIsClean != 'boolean') return {
    isAccepted: false,
    message: 'environment is clean format is invalid',
    field: 'environmentIsClean'
  };
  if (typeof environmentIsComfortable != 'boolean') return {
    isAccepted: false,
    message: 'environment is comfortable format is invalid',
    field: 'environmentIsComfortable'
  };
  if (typeof staffIsFriendly != 'boolean') return {
    isAccepted: false,
    message: 'staff is friendly format is invalid',
    field: 'staffIsFriendly'
  };
  if (typeof staffIsResponsive != 'boolean') return {
    isAccepted: false,
    message: 'staff is responsive format is invalid',
    field: 'staffIsResponsive'
  };
  if (typeof healthcareProviderAttentiveness != 'number') return {
    isAccepted: false,
    message: 'healthcare provider attentiveness format is invalid',
    field: 'healthcareProviderAttentiveness'
  };
  if (typeof healthcareProviderIsAddressedAdequately != 'boolean') return {
    isAccepted: false,
    message: 'healthcare provider is addressed adequately format is invalid',
    field: 'healthcareProviderIsAddressedAdequately'
  };
  if (typeof healthcareProviderTreatmentExplanation != 'number') return {
    isAccepted: false,
    message: 'healthcare provider is treatment explained clearly format is invalid',
    field: 'healthcareProviderTreatmentExplanation'
  };
  if (typeof healthcareProviderIsMedicalHistoryAsked != 'boolean') return {
    isAccepted: false,
    message: 'healthcare provider is medical history asked format is invalid',
    field: 'healthcareProviderIsMedicalHistoryAsked'
  };
  if (typeof appointmentsIsConvenientTimeSlotFound != 'boolean') return {
    isAccepted: false,
    message: 'appointment is convenient time slot found format is invalid',
    field: 'appointmentsIsConvenientTimeSlotFound'
  };
  if (typeof appointmentsIsSchedulingEasy != 'boolean') return {
    isAccepted: false,
    message: 'appointment is scheduling easy format is invalid',
    field: 'appointmentsIsSchedulingEasy'
  };
  if (typeof appointmentsIsReminderSent != 'boolean') return {
    isAccepted: false,
    message: 'appointment is reminder sent format is invalid',
    field: 'appointmentsIsReminderSent'
  };
  if (typeof appointmentsSchedulingWay != 'string') return {
    isAccepted: false,
    message: 'appointment scheduling way format is invalid',
    field: 'appointmentsSchedulingWay'
  };
  if (!config.SCHEDULING_WAYS.includes(appointmentsSchedulingWay)) return {
    isAccepted: false,
    message: 'Invalid value for appointment scheduling way',
    field: 'appointmentsSchedulingWay'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: patientSurveyData
  };
};

var updatePatientSurvey = function updatePatientSurvey(patientSurveyData) {
  var overallExperience = patientSurveyData.overallExperience,
      callDuration = patientSurveyData.callDuration,
      waitingTimeWaited = patientSurveyData.waitingTimeWaited,
      waitingIsDelayHappened = patientSurveyData.waitingIsDelayHappened,
      waitingIsDelayInformed = patientSurveyData.waitingIsDelayInformed,
      waitingSatisfaction = patientSurveyData.waitingSatisfaction,
      environmentIsClean = patientSurveyData.environmentIsClean,
      environmentIsComfortable = patientSurveyData.environmentIsComfortable,
      staffIsFriendly = patientSurveyData.staffIsFriendly,
      staffIsResponsive = patientSurveyData.staffIsResponsive,
      healthcareProviderAttentiveness = patientSurveyData.healthcareProviderAttentiveness,
      healthcareProviderIsAddressedAdequately = patientSurveyData.healthcareProviderIsAddressedAdequately,
      healthcareProviderTreatmentExplanation = patientSurveyData.healthcareProviderTreatmentExplanation,
      healthcareProviderIsMedicalHistoryAsked = patientSurveyData.healthcareProviderIsMedicalHistoryAsked,
      appointmentsIsConvenientTimeSlotFound = patientSurveyData.appointmentsIsConvenientTimeSlotFound,
      appointmentsIsSchedulingEasy = patientSurveyData.appointmentsIsSchedulingEasy,
      appointmentsIsReminderSent = patientSurveyData.appointmentsIsReminderSent,
      appointmentsSchedulingWay = patientSurveyData.appointmentsSchedulingWay;
  if (typeof overallExperience != 'number') return {
    isAccepted: false,
    message: 'Overall experience format is invalid',
    field: 'overallExperience'
  };
  if (callDuration && typeof callDuration != 'number') return {
    isAccepted: false,
    message: 'Call duration format is invalid',
    field: 'callDuration'
  };
  if (typeof waitingTimeWaited != 'number') return {
    isAccepted: false,
    message: 'waiting time format is invalid',
    field: 'waitingTimeWaited'
  };
  if (typeof waitingIsDelayHappened != 'boolean') return {
    isAccepted: false,
    message: 'waiting is delayed happened format is invalid',
    field: 'waitingIsDelayHappened'
  };
  if (typeof waitingIsDelayInformed != 'boolean') return {
    isAccepted: false,
    message: 'waiting is delay informed format is invalid',
    field: 'waitingIsDelayInformed'
  };
  if (typeof waitingSatisfaction != 'number') return {
    isAccepted: false,
    message: 'waiting satisfaction format is invalid',
    field: 'waitingSatisfaction'
  };
  if (typeof environmentIsClean != 'boolean') return {
    isAccepted: false,
    message: 'environment is clean format is invalid',
    field: 'environmentIsClean'
  };
  if (typeof environmentIsComfortable != 'boolean') return {
    isAccepted: false,
    message: 'environment is comfortable format is invalid',
    field: 'environmentIsComfortable'
  };
  if (typeof staffIsFriendly != 'boolean') return {
    isAccepted: false,
    message: 'staff is friendly format is invalid',
    field: 'staffIsFriendly'
  };
  if (typeof staffIsResponsive != 'boolean') return {
    isAccepted: false,
    message: 'staff is responsive format is invalid',
    field: 'staffIsResponsive'
  };
  if (typeof healthcareProviderAttentiveness != 'number') return {
    isAccepted: false,
    message: 'healthcare provider attentiveness format is invalid',
    field: 'healthcareProviderAttentiveness'
  };
  if (typeof healthcareProviderIsAddressedAdequately != 'boolean') return {
    isAccepted: false,
    message: 'healthcare provider is addressed adequately format is invalid',
    field: 'healthcareProviderIsAddressedAdequately'
  };
  if (typeof healthcareProviderTreatmentExplanation != 'number') return {
    isAccepted: false,
    message: 'healthcare provider treatment explained clearly format is invalid',
    field: 'healthcareProviderTreatmentExplanation'
  };
  if (typeof healthcareProviderIsMedicalHistoryAsked != 'boolean') return {
    isAccepted: false,
    message: 'healthcare provider is medical history asked format is invalid',
    field: 'healthcareProviderIsMedicalHistoryAsked'
  };
  if (typeof appointmentsIsConvenientTimeSlotFound != 'boolean') return {
    isAccepted: false,
    message: 'appointment is convenient time slot found format is invalid',
    field: 'appointmentsIsConvenientTimeSlotFound'
  };
  if (typeof appointmentsIsSchedulingEasy != 'boolean') return {
    isAccepted: false,
    message: 'appointment is scheduling easy format is invalid',
    field: 'appointmentsIsSchedulingEasy'
  };
  if (typeof appointmentsIsReminderSent != 'boolean') return {
    isAccepted: false,
    message: 'appointment is reminder sent format is invalid',
    field: 'appointmentsIsReminderSent'
  };
  if (typeof appointmentsSchedulingWay != 'string') return {
    isAccepted: false,
    message: 'appointment scheduling way format is invalid',
    field: 'appointmentsSchedulingWay'
  };
  if (!config.SCHEDULING_WAYS.includes(appointmentsSchedulingWay)) return {
    isAccepted: false,
    message: 'Invalid value for appointment scheduling way',
    field: 'appointmentsSchedulingWay'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: patientSurveyData
  };
};

module.exports = {
  addPatientSurvey: addPatientSurvey,
  updatePatientSurvey: updatePatientSurvey
};