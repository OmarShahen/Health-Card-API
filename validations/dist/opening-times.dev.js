"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var addOpeningTime = function addOpeningTime(openingTimeData) {
  var leadId = openingTimeData.leadId,
      clinicId = openingTimeData.clinicId,
      weekday = openingTimeData.weekday,
      openingTime = openingTimeData.openingTime,
      closingTime = openingTimeData.closingTime;
  if (!leadId && !clinicId) return {
    isAccepted: false,
    message: 'Entity relation is required',
    field: 'leadId'
  };
  if (clinicId && !utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Clinic Id format is invalid',
    field: 'clinicId'
  };
  if (leadId && !utils.isObjectId(leadId)) return {
    isAccepted: false,
    message: 'Lead Id format is invalid',
    field: 'leadId'
  };
  if (!weekday) return {
    isAccepted: false,
    message: 'Weekday is required',
    field: 'weekday'
  };
  if (!config.WEEK_DAYS.includes(weekday)) return {
    isAccepted: false,
    message: 'Weekday format is invalid',
    field: 'weekday'
  };
  if (!openingTime) return {
    isAccepted: false,
    message: 'Opening time is required',
    field: 'openingTime'
  };
  if (!utils.isTimeValid(openingTime)) return {
    isAccepted: false,
    message: 'Opening time format is invalid',
    field: 'openingTime'
  };
  if (!closingTime) return {
    isAccepted: false,
    message: 'Closing time is required',
    field: 'closingTime'
  };
  if (!utils.isTimeValid(closingTime)) return {
    isAccepted: false,
    message: 'Closing time format is invalid',
    field: 'closingTime'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: openingTimeData
  };
};

var updateOpeningTime = function updateOpeningTime(openingTimeData) {
  var weekday = openingTimeData.weekday,
      openingTime = openingTimeData.openingTime,
      closingTime = openingTimeData.closingTime;
  if (!weekday) return {
    isAccepted: false,
    message: 'Weekday is required',
    field: 'weekday'
  };
  if (!config.WEEK_DAYS.includes(weekday)) return {
    isAccepted: false,
    message: 'Weekday format is invalid',
    field: 'weekday'
  };
  if (!openingTime) return {
    isAccepted: false,
    message: 'Opening time is required',
    field: 'openingTime'
  };
  if (!utils.isTimeValid(openingTime)) return {
    isAccepted: false,
    message: 'Opening time format is invalid',
    field: 'openingTime'
  };
  if (!closingTime) return {
    isAccepted: false,
    message: 'Closing time is required',
    field: 'closingTime'
  };
  if (!utils.isTimeValid(closingTime)) return {
    isAccepted: false,
    message: 'Closing time format is invalid',
    field: 'closingTime'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: openingTimeData
  };
};

module.exports = {
  addOpeningTime: addOpeningTime,
  updateOpeningTime: updateOpeningTime
};