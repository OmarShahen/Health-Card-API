"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var moment = require('moment');

var addAppointment = function addAppointment(appointmentData) {
  var patientId = appointmentData.patientId,
      clinicId = appointmentData.clinicId,
      doctorId = appointmentData.doctorId,
      serviceId = appointmentData.serviceId,
      status = appointmentData.status,
      reservationTime = appointmentData.reservationTime;
  if (!patientId) return {
    isAccepted: false,
    message: 'patient Id is required',
    field: 'patientId'
  };
  if (!utils.isObjectId(patientId)) return {
    isAccepted: false,
    message: 'invalid patient Id format',
    field: 'patientId'
  };
  if (!clinicId) return {
    isAccepted: false,
    message: 'clinic Id is required',
    field: 'clinicId'
  };
  if (!utils.isObjectId(clinicId)) return {
    isAccepted: false,
    message: 'invalid clinic Id format',
    field: 'clinicId'
  };
  if (!doctorId) return {
    isAccepted: false,
    message: 'doctor Id is required',
    field: 'doctorId'
  };
  if (!utils.isObjectId(doctorId)) return {
    isAccepted: false,
    message: 'invalid doctor Id format',
    field: 'doctorId'
  };
  if (serviceId && !utils.isObjectId(serviceId)) return {
    isAccepted: false,
    message: 'invalid service Id format',
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
  if (!reservationTime) return {
    isAccepted: false,
    message: 'reservation time is required',
    field: 'reservationTime'
  };
  if (!utils.isDateTimeValid(reservationTime)) return {
    isAccepted: false,
    message: 'invalid date format',
    field: 'reservationTime'
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