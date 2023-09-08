"use strict";

var mongoose = require('mongoose');

var InsuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  isActive: {
    type: Boolean,
    "default": true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Insurance', InsuranceSchema);