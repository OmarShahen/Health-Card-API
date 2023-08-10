"use strict";

var utils = require('../utils/utils');

var addInsurance = function addInsurance(insuranceData) {
  var name = insuranceData.name,
      clinicId = insuranceData.clinicId;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'name'
  };
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
  return {
    isAccepted: true,
    message: 'data is valid',
    data: insuranceData
  };
};

var updateInsurance = function updateInsurance(insuranceData) {
  var name = insuranceData.name;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'name'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: insuranceData
  };
};

module.exports = {
  addInsurance: addInsurance,
  updateInsurance: updateInsurance
};