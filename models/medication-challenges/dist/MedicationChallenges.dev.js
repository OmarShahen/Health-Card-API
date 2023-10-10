"use strict";

var mongoose = require('mongoose');

var MedicationChallengesSchema = new mongoose.Schema({
  medicationChallengeId: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('MedicationChallenge', MedicationChallengesSchema);