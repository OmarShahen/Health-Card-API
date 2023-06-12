"use strict";

var mongoose = require('mongoose');

var ClinicDoctorSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('ClinicDoctor', ClinicDoctorSchema);