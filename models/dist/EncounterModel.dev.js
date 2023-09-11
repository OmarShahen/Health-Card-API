"use strict";

var mongoose = require('mongoose');

var EncounterSchema = new mongoose.Schema({
  encounterId: {
    type: Number,
    required: true
  },
  doctorId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  symptoms: [],
  diagnosis: [],
  notes: []
}, {
  timestamps: true
});
module.exports = mongoose.model('Encounter', EncounterSchema);