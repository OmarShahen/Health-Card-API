const mongoose = require('mongoose')
const config = require('../config/config')
const { HealthHistorySchema } = require('../models/HealthHistoryModel')

const PatientSchema = new mongoose.Schema({

    cardId: { type: Number, required: true },
    cardUUID: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    countryCode: { type: Number, required: true },
    phone: { type: Number, required: true },
    gender: { type: String, enum: config.GENDER },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String, enum: config.BLOOD_GROUPS },
    emergencyContacts: [],
    healthHistory: HealthHistorySchema,
    doctors: []

}, { timestamps: true })

module.exports = mongoose.model('Patient', PatientSchema)