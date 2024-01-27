"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var UserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  title: {
    type: String
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
    type: String
  },
  gender: {
    type: String,
    "enum": config.GENDER
  },
  dateOfBirth: {
    type: Date
  },
  lang: {
    type: String,
    "default": 'ar',
    "enum": config.LANGUAGES
  },
  timeZone: {
    type: String,
    "default": "Africa/Cairo"
  },
  profileImageURL: {
    type: String
  },
  oauth: {
    isGoogleAuth: {
      type: Boolean,
      "default": false
    }
  },
  pricing: [],
  rating: {
    type: Number,
    "default": 5
  },
  totalReviews: {
    type: Number,
    "default": 0
  },
  views: {
    type: Number,
    "default": 0
  },
  totalAppointments: {
    type: Number,
    "default": 0
  },
  speciality: [],
  subSpeciality: [],
  roles: [],
  type: {
    type: String,
    required: true,
    "enum": config.TYPES
  },
  isEmployee: {
    type: Boolean,
    "default": false
  },
  isVerified: {
    type: Boolean,
    required: true,
    "default": false
  },
  isShow: {
    type: Boolean,
    "default": true
  },
  isBlocked: {
    type: Boolean,
    "default": false
  },
  isDeactivated: {
    type: Boolean,
    "default": false
  },
  lastLoginDate: {
    type: Date
  },
  paymentInfo: {
    paymentMethod: {
      type: String,
      "default": 'BANK',
      "enum": ['BANK', 'MOBILE_WALLET']
    },
    bankAccount: {
      accountNumber: {
        type: Number
      },
      accountHolderName: {
        type: String
      },
      bankName: {
        type: String
      }
    },
    mobileWallet: {
      walletNumber: {
        type: String
      }
    }
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