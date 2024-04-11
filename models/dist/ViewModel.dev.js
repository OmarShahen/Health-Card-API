"use strict";

var mongoose = require('mongoose');

var ViewSchema = new mongoose.Schema({
  seekerId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  expertId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  page: {
    type: String,
    "default": 'PROFILE'
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('View', ViewSchema);