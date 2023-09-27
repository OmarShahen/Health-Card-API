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
  },
  survey: {
    isDone: {
      type: Boolean,
      "default": false
    },
    doneById: {
      type: mongoose.Types.ObjectId
    },
    doneDate: {
      type: Date
    }
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('ClinicPatient', ClinicPatientSchema);