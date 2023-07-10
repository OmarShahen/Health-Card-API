"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var addClinicRequest = function addClinicRequest(clinicRequestData) {
  var clinicId = clinicRequestData.clinicId,
      userId = clinicRequestData.userId,
      role = clinicRequestData.role;
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
  if (!role) return {
    isAccepted: false,
    message: 'Role is required',
    field: 'role'
  };
  if (typeof role != 'string') return {
    isAccepted: false,
    message: 'Invalid role format',
    field: 'role'
  };
  if (!config.ROLES.includes(role)) return {
    isAccepted: false,
    message: 'Not registered role',
    field: 'role'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicRequestData
  };
};

var addClinicRequestByReceiverEmail = function addClinicRequestByReceiverEmail(clinicRequestData) {
  var clinicId = clinicRequestData.clinicId,
      email = clinicRequestData.email;
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
  if (!email) return {
    isAccepted: false,
    message: 'email is required',
    field: 'email'
  };
  if (!utils.isEmailValid(email)) return {
    isAccepted: false,
    message: 'email format is invalid',
    field: 'email'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: clinicRequestData
  };
};

var addStaffClinicRequestByClinicId = function addStaffClinicRequestByClinicId(clinicRequestData) {
  var clinicId = clinicRequestData.clinicId,
      userId = clinicRequestData.userId;
  if (!clinicId) return {
    isAccepted: false,
    message: 'clinic Id is required',
    field: 'clinicId'
  };
  if (typeof clinicId != 'number') return {
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
  addClinicRequest: addClinicRequest,
  addClinicRequestByReceiverEmail: addClinicRequestByReceiverEmail,
  addStaffClinicRequestByClinicId: addStaffClinicRequestByClinicId
};