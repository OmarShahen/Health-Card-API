"use strict";

var mongoose = require('mongoose');

var ClinicOwnerSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('ClinicOwner', ClinicOwnerSchema);