"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var UserSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Types.ObjectId
  },
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  countryCode: {
    type: Number
  },
  phone: {
    type: Number
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    "enum": config.GENDER
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  timeZone: {
    type: String
  },
  speciality: [],
  roles: [],
  isVerified: {
    type: Boolean,
    required: true,
    "default": false
  },
  lastLoginDate: {
    type: Date
  },
  resetPassword: {
    verificationCode: {
      type: Number
    },
    expirationDate: {
      type: Date
    }
  },
  deleteAccount: {
    verificationCode: {
      type: Number
    },
    expirationDate: {
      type: Date
    }
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('User', UserSchema);