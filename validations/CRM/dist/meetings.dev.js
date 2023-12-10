"use strict";

var utils = require('../../utils/utils');

var config = require('../../config/config');

var addMeeting = function addMeeting(meetingData) {
  var leadId = meetingData.leadId,
      status = meetingData.status,
      reservationTime = meetingData.reservationTime,
      note = meetingData.note;
  if (!leadId) return {
    isAccepted: false,
    message: 'Lead ID is required',
    field: 'leadId'
  };
  if (!utils.isObjectId(leadId)) return {
    isAccepted: false,
    message: 'Lead ID format is invalid',
    field: 'leadId'
  };
  if (!status) return {
    isAccepted: false,
    message: 'Status is required',
    field: 'status'
  };
  if (typeof status != 'string') return {
    isAccepted: false,
    message: 'Status format is invalid',
    field: 'status'
  };
  if (!config.APPOINTMENT_STATUS.includes(status)) return {
    isAccepted: false,
    message: 'Status value is not registered',
    field: 'status'
  };
  if (!reservationTime) return {
    isAccepted: false,
    message: 'Reservation time is required',
    field: 'reservationTime'
  };
  if (!utils.isDateTimeValid(reservationTime)) return {
    isAccepted: false,
    message: 'Reservation time format is invalid',
    field: 'reservationTime'
  };
  if (note && typeof note != 'string') return {
    isAccepted: false,
    message: 'Note format is invalid',
    field: 'note'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: meetingData
  };
};

var updateMeeting = function updateMeeting(meetingData) {
  var status = meetingData.status,
      note = meetingData.note;
  if (!status) return {
    isAccepted: false,
    message: 'Status is required',
    field: 'status'
  };
  if (typeof status != 'string') return {
    isAccepted: false,
    message: 'Status format is invalid',
    field: 'status'
  };
  if (!config.APPOINTMENT_STATUS.includes(status)) return {
    isAccepted: false,
    message: 'Status value is not registered',
    field: 'status'
  };
  if (note && typeof note != 'string') return {
    isAccepted: false,
    message: 'Note format is invalid',
    field: 'note'
  };
  return {
    isAccepted: true,
    message: 'data is valid',
    data: meetingData
  };
};

module.exports = {
  addMeeting: addMeeting,
  updateMeeting: updateMeeting
};