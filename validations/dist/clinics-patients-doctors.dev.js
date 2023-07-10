"use strict";

var utils = require('../utils/utils');

var addClinicPatientDoctor = function addClinicPatientDoctor(clinicPatientData) {
  var patientId = clinicPatientData.patientId,
      clinicId = clinicPatientData.clinicId,
      doctorId = clinicPatientData.doctorId;
  if (!patientId) return {
    isAccepted: false,
    message: 'patient Id is required',
    field: 'patientId'
  };
  if (!utils.isObjectId(patientId)) return {
    isAccepted: false,
    message: 'patient Id format is invalid',
    field: 'patientId'
  };
  if (!clinicId) return {
    isAccepted: false,
    message: 'clinic Id is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'clinic Id format is invalid',
    field: 'clinicId'
  };
  if (!doctorId) return {
    isAccepted: false,
    message: 'doctor Id is required',
    field: 'doctorId'
  };
  if (!utils.isObjectId(doctorId)) return {
    isAccepted: false,
    message: 'doctor Id format is invalid',
    field: 'doctorId'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicPatientData
  };
};

var addClinicPatientDoctorByCardId = function addClinicPatientDoctorByCardId(clinicPatientData) {
  var cardId = clinicPatientData.cardId,
      cvc = clinicPatientData.cvc,
      clinicId = clinicPatientData.clinicId,
      doctorId = clinicPatientData.doctorId;
  if (!cardId) return {
    isAccepted: false,
    message: 'card Id is required',
    field: 'cardId'
  };
  if (typeof cardId != 'number') return {
    isAccepted: false,
    message: 'card Id format is invalid',
    field: 'cardId'
  };
  if (!cvc) return {
    isAccepted: false,
    message: 'card cvc is required',
    field: 'cvc'
  };
  if (typeof cvc != 'number') return {
    isAccepted: false,
    message: 'card cvc format is invalid',
    field: 'cvc'
  };
  if (!clinicId) return {
    isAccepted: false,
    message: 'clinic Id is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'clinic Id format is invalid',
    field: 'clinicId'
  };
  if (!doctorId) return {
    isAccepted: false,
    message: 'doctor Id is required',
    field: 'doctorId'
  };
  if (!utils.isObjectId(doctorId)) return {
    isAccepted: false,
    message: 'doctor Id format is invalid',
    field: 'doctorId'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicPatientData
  };
};

module.exports = {
  addClinicPatientDoctor: addClinicPatientDoctor,
  addClinicPatientDoctorByCardId: addClinicPatientDoctorByCardId
};