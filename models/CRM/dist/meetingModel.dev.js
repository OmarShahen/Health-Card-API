"use strict";

var mongoose = require('mongoose');

var config = require('../../config/config');

var MeetingSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    "default": 'UPCOMING',
    "enum": config.APPOINTMENT_STATUS
  },
  reservationTime: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Meeting', MeetingSchema);