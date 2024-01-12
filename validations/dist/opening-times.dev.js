"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var addOpeningTime = function addOpeningTime(openingTimeData) {
  var expertId = openingTimeData.expertId,
      weekday = openingTimeData.weekday,
      openingTime = openingTimeData.openingTime,
      closingTime = openingTimeData.closingTime;
  if (!expertId) return {
    isAccepted: false,
    message: 'Expert ID is required',
    field: 'expertId'
  };
  if (!utils.isObjectId(expertId)) return {
    isAccepted: false,
    message: 'Expert Id format is invalid',
    field: 'expertId'
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

var updateOpeningTimeActivityStatus = function updateOpeningTimeActivityStatus(openingTimeData) {
  var isActive = openingTimeData.isActive;
  if (typeof isActive != 'boolean') return {
    isAccepted: false,
    message: 'isActive format is invalid',
    field: 'isActive'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: openingTimeData
  };
};

module.exports = {
  addOpeningTime: addOpeningTime,
  updateOpeningTime: updateOpeningTime,
  updateOpeningTimeActivityStatus: updateOpeningTimeActivityStatus
};