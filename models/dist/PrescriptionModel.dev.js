"use strict";

var mongoose = require('mongoose');

var _require = require('./MedicineModel'),
    MedicineSchema = _require.MedicineSchema;

var PrescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: Number,
    required: true,
    unique: true
  },
  clinicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  doctorId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  medicines: [MedicineSchema],
  notes: []
}, {
  timestamps: true
});
module.exports = mongoose.model('Prescription', PrescriptionSchema);