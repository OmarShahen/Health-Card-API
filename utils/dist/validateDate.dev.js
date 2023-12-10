"use strict";

var moment = require('moment');

var isDateValid = function isDateValid(date) {
  return moment(date, 'YYYY-MM-DD', true).isValid();
};

var isDateTimeValid = function isDateTimeValid(dateTime) {
  var timestamp = Date.parse(dateTime);

  if (isNaN(timestamp)) {
    return false;
  }

  return true;
};

var isBirthYearValid = function isBirthYearValid(date) {
  return moment(date, 'YYYY', true).isValid();
};

var isTimeValid = function isTimeValid(timeString) {
  var format = 'HH:mm';
  var time = moment(timeString, format, true);

  if (time.isValid()) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  isDateValid: isDateValid,
  isBirthYearValid: isBirthYearValid,
  isDateTimeValid: isDateTimeValid,
  isTimeValid: isTimeValid
};