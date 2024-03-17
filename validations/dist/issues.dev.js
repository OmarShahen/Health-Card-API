"use strict";

var utils = require('../utils/utils');

var addIssue = function addIssue(issueData) {
  var name = issueData.name,
      specialityId = issueData.specialityId;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Name format is invalid',
    field: 'name'
  };
  if (!specialityId) return {
    isAccepted: false,
    message: 'Speciality ID is required',
    field: 'specialityId'
  };
  if (!utils.isObjectId(specialityId)) return {
    isAccepted: false,
    message: 'Speciality Id format is invalid',
    field: 'specialityId'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: issueData
  };
};

var updateIssue = function updateIssue(issueData) {
  var name = issueData.name;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Name format is invalid',
    field: 'name'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: issueData
  };
};

module.exports = {
  addIssue: addIssue,
  updateIssue: updateIssue
};