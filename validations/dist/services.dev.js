"use strict";

var utils = require('../utils/utils');

var addService = function addService(serviceData) {
  var clinicId = serviceData.clinicId,
      name = serviceData.name,
      cost = serviceData.cost;
  if (!clinicId) return {
    isAccepted: false,
    message: 'Clinic Id is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'Clinic Id format is invalid',
    field: 'clinicId'
  };
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'name'
  };
  if (!cost) return {
    isAccepted: false,
    message: 'Cost is required',
    field: 'cost'
  };
  if (typeof cost != 'number') return {
    isAccepted: false,
    message: 'Invalid cost format',
    field: 'cost'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: serviceData
  };
};

var updateService = function updateService(serviceData) {
  var name = serviceData.name,
      cost = serviceData.cost;
  if (!name) return {
    isAccepted: false,
    message: 'Name is required',
    field: 'name'
  };
  if (typeof name != 'string') return {
    isAccepted: false,
    message: 'Invalid name format',
    field: 'name'
  };
  if (!cost) return {
    isAccepted: false,
    message: 'Cost is required',
    field: 'cost'
  };
  if (typeof cost != 'number') return {
    isAccepted: false,
    message: 'Invalid cost format',
    field: 'cost'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: serviceData
  };
};

module.exports = {
  addService: addService,
  updateService: updateService
};