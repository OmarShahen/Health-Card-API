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
    required: true
  },
  note: {
    type: String
  },
  isRecommend: {
    type: Boolean
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Review', ReviewSchema);