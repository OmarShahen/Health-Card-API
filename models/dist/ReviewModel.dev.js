"use strict";

var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  reviewId: {
    type: Number,
    required: true
  },
  expertId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  seekerId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  rating: {
    type: Number,
    "default": 5,
    min: 0,
    max: 5
  },
  communication: {
    type: Number,
    "default": 5,
    min: 0,
    max: 5
  },
  understanding: {
    type: Number,
    "default": 5,
    min: 0,
    max: 5
  },
  solutions: {
    type: Number,
    "default": 5,
    min: 0,
    max: 5
  },
  commitment: {
    type: Number,
    "default": 5,
    min: 0,
    max: 5
  },
  note: {
    type: String
  },
  isRecommend: {
    type: Boolean,
    "default": true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Review', ReviewSchema);