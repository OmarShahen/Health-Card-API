"use strict";

var mongoose = require('mongoose');

var CardSchema = new mongoose.Schema({
  cardId: {
    type: Number,
    required: true,
    unique: true
  },
  cvc: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Card', CardSchema);