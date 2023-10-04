"use strict";

var utils = require('../utils/utils');

var addArrivalMethod = function addArrivalMethod(arrivalMethodData) {
  var name = arrivalMethodData.name;
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
    data: arrivalMethodData
  };
};

var updateArrivalMethod = function updateArrivalMethod(arrivalMethodData) {
  var name = arrivalMethodData.name;
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
    data: arrivalMethodData
  };
};

module.exports = {
  addArrivalMethod: addArrivalMethod,
  updateArrivalMethod: updateArrivalMethod
};