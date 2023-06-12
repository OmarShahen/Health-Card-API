"use strict";

var utils = require('../utils/utils');

var addClinicDoctor = function addClinicDoctor(clinicDoctorData) {
  var doctorId = clinicDoctorData.doctorId,
      clinicId = clinicDoctorData.clinicId;
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
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicDoctorData
  };
};

module.exports = {
  addClinicDoctor: addClinicDoctor
};