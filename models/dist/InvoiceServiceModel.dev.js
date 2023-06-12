"use strict";

var mongoose = require('mongoose');

var InvoiceServiceSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  serviceId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('InvoiceService', InvoiceServiceSchema);