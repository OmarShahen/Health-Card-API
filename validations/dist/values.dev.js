"use strict";

var config = require('../config/config');

var addValue = function addValue(valueData) {
  var value = valueData.value,
      entity = valueData.entity;
  if (!value) return {
    isAccepted: false,
    message: 'Value is required',
    field: 'value'
  };
  if (typeof value != 'string') return {
    isAccepted: false,
    message: 'Invalid value format',
    field: 'value'
  };
  if (!entity) return {
    isAccepted: false,
    message: 'Entity is required',
    field: 'entity'
  };
  if (typeof entity != 'string') return {
    isAccepted: false,
    message: 'Invalid entity format',
    field: 'entity'
  };
  if (!config.VALUES_ENTITY.includes(entity)) return {
    isAccepted: false,
    message: 'This value is not registered',
    field: 'entity'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: valueData
  };
};

var updateValueValue = function updateValueValue(valueData) {
  var value = valueData.value;
  if (!value) return {
    isAccepted: false,
    message: 'Value is required',
    field: 'value'
  };
  if (typeof value != 'string') return {
    isAccepted: false,
    message: 'Invalid value format',
    field: 'value'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: valueData
  };
};

module.exports = {
  addValue: addValue,
  updateValueValue: updateValueValue
};