"use strict";

var mongoose = require('mongoose');

var VisitReasonSchema = new mongoose.Schema({
  visitReasonId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('VisitReason', VisitReasonSchema);