"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var InsurancePolicySchema = new mongoose.Schema({
  insuranceCompanyId: {
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
  type: {
    type: String,
    required: true,
    "enum": config.INSURANCE_POLICY_TYPE
  },
  coveragePercentage: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    "enum": config.INSURANCE_POLICY_STATUS
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
module.exports = mongoose.model('InsurancePolicy', InsurancePolicySchema);