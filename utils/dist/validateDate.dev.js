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

  return true; //return moment(dateTime, 'YYYY-MM-DD HH:mm:ss', true).isValid()
};

var isBirthYearValid = function isBirthYearValid(date) {
  return moment(date, 'YYYY', true).isValid();
};

module.exports = {
  isDateValid: isDateValid,
  isBirthYearValid: isBirthYearValid,
  isDateTimeValid: isDateTimeValid
};