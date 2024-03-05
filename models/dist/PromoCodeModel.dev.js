"use strict";

var mongoose = require('mongoose');

var PromoCodeSchema = new mongoose.Schema({
  promoCodeId: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  percentage: {
    type: Number,
    required: true,
    max: 1,
    min: 0
  },
  isActive: {
    type: Boolean,
    "default": false
  },
  maxUsage: {
    type: Number,
    "default": 0
  },
  userMaxUsage: {
    type: Number,
    "default": 1
  },
  expirationDate: {
    type: Date
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('PromoCode', PromoCodeSchema);