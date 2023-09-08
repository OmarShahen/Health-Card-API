"use strict";

var utils = require('../utils/utils');

var addInsurance = function addInsurance(insuranceData) {
  var name = insuranceData.name,
      clinicId = insuranceData.clinicId,
      startDate = insuranceData.startDate,
      endDate = insuranceData.endDate;
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
  if (!startDate) return {
    isAccepted: false,
    message: 'Start date is required',
    field: 'startDate'
  };
  if (!utils.isDateValid(startDate)) return {
    isAccepted: false,
    message: 'Start date format is invalid',
    field: 'startDate'
  };
  if (!endDate) return {
    isAccepted: false,
    message: 'End date is required',
    field: 'endDate'
  };
  if (!utils.isDateValid(endDate)) return {
    isAccepted: false,
    message: 'End date format is invalid',
    field: 'endDate'
  };
  if (new Date(startDate) >= new Date(endDate)) return {
    isAccepted: false,
    message: 'Start date cannot pass end date',
    field: 'endDate'
  };
  if (new Date(endDate) < new Date()) return {
    isAccepted: false,
    message: 'End date has already passed',
    field: 'enddate'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: insuranceData
  };
};

var updateInsurance = function updateInsurance(insuranceData) {
  var name = insuranceData.name,
      startDate = insuranceData.startDate,
      endDate = insuranceData.endDate;
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
  if (!startDate) return {
    isAccepted: false,
    message: 'Start date is required',
    field: 'startDate'
  };
  if (!utils.isDateValid(startDate)) return {
    isAccepted: false,
    message: 'Start date format is invalid',
    field: 'startDate'
  };
  if (!endDate) return {
    isAccepted: false,
    message: 'End date is required',
    field: 'endDate'
  };
  if (!utils.isDateValid(endDate)) return {
    isAccepted: false,
    message: 'End date format is invalid',
    field: 'endDate'
  };
  if (new Date(startDate) >= new Date(endDate)) return {
    isAccepted: false,
    message: 'Start date cannot pass end date',
    field: 'endDate'
  };
  if (new Date(endDate) < new Date()) return {
    isAccepted: false,
    message: 'End date has already passed',
    field: 'enddate'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: insuranceData
  };
};

var updateInsuranceStatus = function updateInsuranceStatus(insuranceData) {
  var isActive = insuranceData.isActive;
  if (typeof isActive != 'boolean') return {
    isAccepted: false,
    message: 'invalid status format',
    field: 'isActive'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: insuranceData
  };
};

module.exports = {
  addInsurance: addInsurance,
  updateInsurance: updateInsurance,
  updateInsuranceStatus: updateInsuranceStatus
};