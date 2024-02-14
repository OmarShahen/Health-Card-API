"use strict";

var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
  paymentId: {
    type: Number,
    required: true,
    unique: true
  },
  appointmentId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  expertId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  seekerId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  transactionId: {
    type: Number,
    required: true
  },
  isExpertPaid: {
    type: Boolean,
    "default": false
  },
  success: {
    type: Boolean,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  },
  isRefunded: {
    type: Boolean,
    "default": false
  },
  gateway: {
    type: String,
    required: true
  },
  method: {
    type: String
  },
  orderId: {
    type: Number
  },
  amountCents: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    "default": 'EGP'
  }
}, {
  timestamps: true
});
0;
module.exports = mongoose.model('Payment', PaymentSchema);