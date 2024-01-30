"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var ExpertVerificationSchema = new mongoose.Schema({
  expertVerificationId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  countryCode: {
    type: Number,
    "default": 20
  },
  nationality: {
    type: String,
    "default": 'EGYPT',
    "enum": ['EGYPT']
  },
  status: {
    type: String,
    "default": 'PENDING',
    "enum": config.EXPERT_VERIFICATION_STATUS
  },
  rejectionReason: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  specialityId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  websiteURL: {
    type: String
  },
  facebookURL: {
    type: String
  },
  instagramURL: {
    type: String
  },
  youtubeURL: {
    type: String
  },
  linkedInURL: {
    type: String
  },
  tiktokURL: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('ExpertVerification', ExpertVerificationSchema);