"use strict";

var getTime = function getTime(dateTimeValue, timeZone) {
  return new Date(dateTimeValue).toLocaleTimeString('en', {
    timeZone: timeZone
  });
};

var getAge = function getAge(dateOfBirth) {
  return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
};

var getHoursDifference = function getHoursDifference(date1, date2) {
  var diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
  var hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  return hours;
};

module.exports = {
  getTime: getTime,
  getAge: getAge,
  getHoursDifference: getHoursDifference
};