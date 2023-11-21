"use strict";

var mongoose = require('mongoose');

var ValueSchema = new mongoose.Schema({
  valueId: {
    type: Number,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Value', ValueSchema);