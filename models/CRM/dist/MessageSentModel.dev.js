"use strict";

var mongoose = require('mongoose');

var MessageSentSchema = new mongoose.Schema({
  messageSentId: {
    type: Number,
    required: true
  },
  messageTemplateId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  leadId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  isOpened: {
    type: Boolean,
    required: true
  },
  openedDate: {
    type: Date,
    required: true
  },
  isResponded: {
    type: Boolean,
    required: true
  },
  respondedDate: {
    type: Date,
    required: true
  },
  isCTADone: {
    type: Boolean,
    required: true,
    "default": false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('MessageSent', MessageSentSchema);