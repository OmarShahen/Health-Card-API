"use strict";

var mongoose = require('mongoose');

var EmailVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectID,
    required: true
  },
  code: {
    type: Number,
    required: true
  }
});
module.exports = mongoose.model('EmailVerification', EmailVerificationSchema);