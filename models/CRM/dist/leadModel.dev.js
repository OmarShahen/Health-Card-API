"use strict";

var mongoose = require('mongoose');

var LeadSchema = new mongoose.Schema({
  leadId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    "enum": ['MALE', 'FEMALE']
  },
  countryCode: {
    type: Number
  },
  phone: {
    type: Number
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  county: {
    type: String
  },
  address: {
    type: String
  },
  clinic: {
    name: {
      type: String
    },
    countryCode: {
      type: Number
    },
    phone: {
      type: Number
    }
  },
  specialityId: {
    type: mongoose.Types.ObjectId
  },
  note: {
    type: String
  },
  labels: [],
  value: {
    type: Number,
    "default": 0
  },
  status: {
    type: String
  },
  stage: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Lead', LeadSchema);