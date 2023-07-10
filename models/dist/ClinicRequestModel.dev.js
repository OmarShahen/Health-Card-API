"use strict";

var mongoose = require('mongoose');

var ClinicRequestSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    required: true,
    "default": 'PENDING',
    "enum": ['PENDING', 'ACCEPTED', 'REJECTED']
  },
  role: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('ClinicRequest', ClinicRequestSchema);