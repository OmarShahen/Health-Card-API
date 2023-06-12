"use strict";

var utils = require('../utils/utils');

var addSpeciality = function addSpeciality(specialData) {
  var name = specialData.name,
      description = specialData.description;
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
    data: specialData
  };
};

var updateSpeciality = function updateSpeciality(specialData) {
  var name = specialData.name,
      description = specialData.description;
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
    data: specialData
  };
};

module.exports = {
  addSpeciality: addSpeciality,
  updateSpeciality: updateSpeciality
};