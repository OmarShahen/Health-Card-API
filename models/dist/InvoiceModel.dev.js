"use strict";

var mongoose = require('mongoose');

var config = require('../config/config');

var InvoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: Number,
    required: true,
    unique: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  totalCost: {
    type: Number,
    required: true,
    "default": 0
  },
  paid: {
    type: Number,
    "default": 0
  },
  status: {
    type: String,
    required: true,
    "enum": config.INVOICE_STATUS
  },
  paymentMethod: {
    type: String,
    "enum": config.PAYMENT_METHOD
  },
  invoiceDate: {
    type: Date,
    "default": new Date()
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Invoice', InvoiceSchema);