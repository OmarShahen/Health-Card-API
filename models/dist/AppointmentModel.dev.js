"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  doctorId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  serviceId: {
    type: mongoose.Types.ObjectId
  },
  status: {
    type: String,
    "default": 'UPCOMING',
    "enum": config.APPOINTMENT_STATUS
  },
  reservationTime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Appointment', AppointmentSchema);