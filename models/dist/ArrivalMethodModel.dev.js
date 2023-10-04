"use strict";

var mongoose = require('mongoose');

var ArrivalMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('ArrivalMethod', ArrivalMethodSchema);