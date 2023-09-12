"use strict";

var getTime = function getTime(dateTimeValue, timeZone) {
  return new Date(dateTimeValue).toLocaleTimeString('en', {
    timeZone: timeZone
  });
};

module.exports = {
  getTime: getTime
};