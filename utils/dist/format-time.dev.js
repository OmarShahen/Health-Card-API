"use strict";

var getTime = function getTime(dateTimeValue, timeZone) {
  return new Date(dateTimeValue).toLocaleTimeString('en', {
    timeZone: timeZone
  });
};

var getAge = function getAge(dateOfBirth) {
  return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
};

module.exports = {
  getTime: getTime,
  getAge: getAge
};