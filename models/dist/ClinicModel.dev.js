"use strict";

var mongoose = require('mongoose');

var ClinicSchema = new mongoose.Schema({
  clinicId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
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
  countryCode: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Clinic', ClinicSchema);