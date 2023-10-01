"use strict";

var mongoose = require('mongoose');

var CallSchema = new mongoose.Schema({
  callId: {
    type: Number,
    required: true
  },
  doneById: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientSurveyId: {
    type: mongoose.Types.ObjectId
  },
  duration: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Call', CallSchema);