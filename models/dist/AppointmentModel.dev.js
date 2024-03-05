"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var AppointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: Number
  },
  seekerId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  expertId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  paymentId: {
    type: mongoose.Types.ObjectId
  },
  serviceId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  promoCodeId: {
    type: mongoose.Types.ObjectId
  },
  roomId: {
    type: String
  },
  isPaid: {
    type: Boolean,
    "default": false
  },
  isOnlineBooking: {
    type: Boolean,
    "default": false
  },
  duration: {
    type: Number
  },
  originalPrice: {
    type: Number,
    "default": 0
  },
  price: {
    type: Number,
    "default": 0
  },
  status: {
    type: String,
    "default": 'UPCOMING',
    "enum": config.APPOINTMENT_STATUS
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  meetingLink: {
    type: String
  },
  verification: {
    type: String
  },
  discountPercentage: {
    type: Number
  },
  payment: {
    transactionId: {
      type: String
    },
    gateway: {
      type: String
    }
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Appointment', AppointmentSchema);