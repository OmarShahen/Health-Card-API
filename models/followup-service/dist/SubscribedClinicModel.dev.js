"use strict";

var mongoose = require('mongoose');

var SubscribedClinicSchema = new mongoose.Schema({
  subscriptionId: {
    type: Number,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  paid: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
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
module.exports = mongoose.model('SubscribedClinic', SubscribedClinicSchema);