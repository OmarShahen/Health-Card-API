"use strict";

var utils = require('../utils/utils');

var addVisitReason = function addVisitReason(visitReasonData) {
  var name = visitReasonData.name,
      description = visitReasonData.description;
  if (!name) return {
    isAccepted: false,
    message: 'name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'name'
  };
  if (description && typeof description != 'string') return {
    isAccepted: false,
    message: 'Invalid description formate',
    field: 'description'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: visitReasonData
  };
};

var updateVisitReason = function updateVisitReason(visitReasonData) {
  var name = visitReasonData.name,
      description = visitReasonData.description;
  if (!name) return {
    isAccepted: false,
    message: 'name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name formate',
    field: 'name'
  };
  if (description && !utils.isNameValid(description)) return {
    isAccepted: false,
    message: 'Invalid description formate',
    field: 'description'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: visitReasonData
  };
};

module.exports = {
  addVisitReason: addVisitReason,
  updateVisitReason: updateVisitReason
};