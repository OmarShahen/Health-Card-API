"use strict";

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  commentId: {
    type: Number,
    required: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId
  },
  memberId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Comment', CommentSchema);