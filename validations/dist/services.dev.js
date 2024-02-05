"use strict";

var utils = require('../utils/utils');

var addService = function addService(serviceData) {
  var expertId = serviceData.expertId,
      title = serviceData.title,
      description = serviceData.description,
      price = serviceData.price,
      duration = serviceData.duration;
  if (!expertId) return {
    isAccepted: false,
    message: 'Expert ID is required',
    field: 'expertId'
  };
  if (!utils.isObjectId(expertId)) return {
    isAccepted: false,
    message: 'Expert ID format is invalid',
    field: 'expertId'
  };
  if (!title) return {
    isAccepted: false,
    message: 'Title is required',
    field: 'title'
  };
  if (typeof title != 'string') return {
    isAccepted: false,
    message: 'Invalid title format',
    field: 'title'
  };
  if (!description) return {
    isAccepted: false,
    message: 'Description is required',
    field: 'description'
  };
  if (typeof description != 'string') return {
    isAccepted: false,
    message: 'Description format is invalid',
    field: 'description'
  };
  if (!price) return {
    isAccepted: false,
    message: 'Price is required',
    field: 'price'
  };
  if (typeof price != 'number') return {
    isAccepted: false,
    message: 'Price format is invalid',
    field: 'price'
  };
  if (!duration) return {
    isAccepted: false,
    message: 'Duration is required',
    field: 'duration'
  };
  if (typeof duration != 'number') return {
    isAccepted: false,
    message: 'Duration format is invalid',
    field: 'duration'
  };
  if (duration < 5) return {
    isAccepted: false,
    message: 'Duration minimum is 5 minutes',
    field: 'duration'
  };
  if (duration > 180) return {
    isAccepted: false,
    message: 'Duration maximum is 180 minutes',
    field: 'duration'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: serviceData
  };
};

var updateService = function updateService(serviceData) {
  var title = serviceData.title,
      description = serviceData.description,
      price = serviceData.price,
      duration = serviceData.duration;
  if (!title) return {
    isAccepted: false,
    message: 'Title is required',
    field: 'title'
  };
  if (typeof title != 'string') return {
    isAccepted: false,
    message: 'Invalid title format',
    field: 'title'
  };
  if (!description) return {
    isAccepted: false,
    message: 'Description is required',
    field: 'description'
  };
  if (typeof description != 'string') return {
    isAccepted: false,
    message: 'Description format is invalid',
    field: 'description'
  };
  if (!price) return {
    isAccepted: false,
    message: 'Price is required',
    field: 'price'
  };
  if (typeof price != 'number') return {
    isAccepted: false,
    message: 'Price format is invalid',
    field: 'price'
  };
  if (!duration) return {
    isAccepted: false,
    message: 'Duration is required',
    field: 'duration'
  };
  if (typeof duration != 'number') return {
    isAccepted: false,
    message: 'Duration format is invalid',
    field: 'duration'
  };
  if (duration < 5) return {
    isAccepted: false,
    message: 'Duration minimum is 5 minutes',
    field: 'duration'
  };
  if (duration > 180) return {
    isAccepted: false,
    message: 'Duration maximum is 180 minutes',
    field: 'duration'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: serviceData
  };
};

var updateServiceActivity = function updateServiceActivity(serviceData) {
  var isActive = serviceData.isActive;
  if (typeof isActive != 'boolean') return {
    isAccepted: false,
    message: 'isActive format is invalid',
    field: 'isActive'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: serviceData
  };
};

module.exports = {
  addService: addService,
  updateService: updateService,
  updateServiceActivity: updateServiceActivity
};