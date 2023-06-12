"use strict";

var mongoose = require('mongoose');

var ServiceSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Service', ServiceSchema);