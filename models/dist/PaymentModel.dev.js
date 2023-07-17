"use strict";

var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  transactionId: {
    type: Number,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  pending: {
    type: Boolean,
    required: true
  },
  gateway: {
    type: String,
    required: true
  },
  orderId: {
    type: Number,
    required: true
  },
  amountCents: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
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
  phoneNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Payment', PaymentSchema);