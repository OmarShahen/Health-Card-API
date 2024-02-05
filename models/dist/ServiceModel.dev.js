"use strict";

var mongoose = require('mongoose');

var ServiceSchema = new mongoose.Schema({
  serviceId: {
    type: Number,
    required: true
  },
  expertId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    "default": true
  },
  format: {
    type: String,
    "default": 'ONE-ON-ONE'
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Service', ServiceSchema);