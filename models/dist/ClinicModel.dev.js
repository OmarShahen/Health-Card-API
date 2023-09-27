"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var ClinicSchema = new mongoose.Schema({
  clinicId: {
    type: Number,
    required: true,
    unique: true
  },
  mode: {
    type: String,
    required: true,
    "enum": config.CLINIC_MODES
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number
  },
  countryCode: {
    type: Number
  },
  speciality: [],
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  activeUntilDate: {
    type: Date
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Clinic', ClinicSchema);