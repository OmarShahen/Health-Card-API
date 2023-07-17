"use strict";

var mongoose = require('mongoose');

var SubscriptionSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  planDurationInDays: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Subscription', SubscriptionSchema);