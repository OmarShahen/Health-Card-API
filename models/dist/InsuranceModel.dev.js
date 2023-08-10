"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var InsuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Insurance', InsuranceSchema);