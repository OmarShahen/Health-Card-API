"use strict";

var mongoose = require('mongoose');

var MessageTemplateSchema = new mongoose.Schema({
  messageTemplateId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
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
module.exports = mongoose.model('MessageTemplate', MessageTemplateSchema);