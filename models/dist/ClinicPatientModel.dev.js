"use strict";

var mongoose = require('mongoose');

var ClinicPatientSchema = new mongoose.Schema({
  patientId: {
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
module.exports = mongoose.model('ClinicPatient', ClinicPatientSchema);