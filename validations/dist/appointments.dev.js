"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var addAppointment = function addAppointment(appointmentData) {
  var seekerId = appointmentData.seekerId,
      expertId = appointmentData.expertId,
      serviceId = appointmentData.serviceId,
      status = appointmentData.status,
      price = appointmentData.price,
      startTime = appointmentData.startTime,
      duration = appointmentData.duration;
  if (!seekerId) return {
    isAccepted: false,
    message: 'Seeker Id is required',
    field: 'seekerId'
  };
  if (!utils.isObjectId(seekerId)) return {
    isAccepted: false,
    message: 'invalid seeker Id format',
    field: 'seekerId'
  };
  if (!expertId) return {
    isAccepted: false,
    message: 'Expert Id is required',
    field: 'expertId'
  };
  if (!utils.isObjectId(expertId)) return {
    isAccepted: false,
    message: 'invalid expert Id format',
    field: 'expertId'
  };
  if (!serviceId) return {
    isAccepted: false,
    message: 'Service Id is required',
    field: 'serviceId'
  };
  if (!utils.isObjectId(serviceId)) return {
    isAccepted: false,
    message: 'Invalid service Id format',
    field: 'serviceId'
  };
  if (!status) return {
    isAccepted: false,
    message: 'status is required',
    field: 'status'
  };
  if (!config.APPOINTMENT_STATUS.includes(status)) return {
    isAccepted: false,
    message: 'invalid status value',
    field: 'status'
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
  if (!startTime) return {
    isAccepted: false,
    message: 'start time is required',
    field: 'startTime'
  };
  if (!utils.isDateTimeValid(startTime)) return {
    isAccepted: false,
    message: 'invalid start time format',
    field: 'startTime'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: appointmentData
  };
};

var updateAppointmentStatus = function updateAppointmentStatus(appointmentData) {
  var status = appointmentData.status;
  if (!status) return {
    isAccepted: false,
    message: 'Status is required',
    field: 'status'
  };
  if (!config.APPOINTMENT_STATUS.includes(status)) return {
    isAccepted: false,
    message: 'Status value is invalid',
    field: 'status'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: appointmentData
  };
};

module.exports = {
  addAppointment: addAppointment,
  updateAppointmentStatus: updateAppointmentStatus
};