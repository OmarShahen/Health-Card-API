"use strict";

var utils = require('../utils/utils');

var config = require('../config/config');

var moment = require('moment');

var addAppointment = function addAppointment(appointmentData) {
  var clinicId = appointmentData.clinicId,
      doctorId = appointmentData.doctorId,
      visitReasonId = appointmentData.visitReasonId,
      patientName = appointmentData.patientName,
      patientPhone = appointmentData.patientPhone,
      patientCountryCode = appointmentData.patientCountryCode,
      status = appointmentData.status,
      reservationTime = appointmentData.reservationTime;
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
  if (!visitReasonId) return {
    isAccepted: false,
    message: 'visit reason Id is required',
    field: 'visitReasonId'
  };
  if (!utils.isObjectId(visitReasonId)) return {
    isAccepted: false,
    message: 'invalid visit reason Id format',
    field: 'visitReasonId'
  };
  if (!patientName) return {
    isAccepted: false,
    message: 'patient name is required',
    field: 'patientName'
  };
  if (typeof patientName != 'string') return {
    isAccepted: false,
    message: 'invalid patient name format',
    field: 'patientName'
  };
  if (!patientPhone) return {
    isAccepted: false,
    message: 'patient phone is required',
    field: 'patientPhone'
  };
  if (typeof patientPhone != 'number') return {
    isAccepted: false,
    message: 'invalid patient phone format',
    field: 'patientPhone'
  };
  if (!patientCountryCode) return {
    isAccepted: false,
    message: 'patient country code is required',
    field: 'patientCountryCode'
  };
  if (typeof patientCountryCode != 'number') return {
    isAccepted: false,
    message: 'invalid patient country code format',
    field: 'patientCountryCode'
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