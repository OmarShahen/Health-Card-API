"use strict";

var utils = require('../utils/utils');

var addClinicRequest = function addClinicRequest(clinicRequestData) {
  var clinicId = clinicRequestData.clinicId,
      userId = clinicRequestData.userId;
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
  if (!userId) return {
    isAccepted: false,
    message: 'user Id is required',
    field: 'userId'
  };
  if (!utils.isObjectId(userId)) return {
    isAccepted: false,
    message: 'user Id format is invalid',
    field: 'userId'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicRequestData
  };
};

module.exports = {
  addClinicRequest: addClinicRequest
};