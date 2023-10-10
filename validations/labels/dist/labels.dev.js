"use strict";

var utils = require('../../utils/utils');

var addLabel = function addLabel(labelData) {
  var name = labelData.name;
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
    data: labelData
  };
};

var updateLabel = function updateLabel(labelData) {
  var name = labelData.name;
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
    data: labelData
  };
};

module.exports = {
  addLabel: addLabel,
  updateLabel: updateLabel
};