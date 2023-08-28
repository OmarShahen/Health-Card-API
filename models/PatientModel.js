const mongoose = require('mongoose')
const config = require('../config/config')
const { HealthHistorySchema } = require('./HealthHistoryModel')
const { EmergencyContactSchema } = require('./EmergencyContactModel')

const PatientSchema = new mongoose.Schema({

    patientId: { type: Number, required: true, unique: true },
    cardId: { type: Number },
    cardUUID: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    socialStatus: { type: String },
    email: { type: String },
    countryCode: { type: Number, required: true },
    city: { type: String },
    phone: { type: Number, required: true },
    gender: { type: String, enum: config.GENDER },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String, enum: config.BLOOD_GROUPS },
    emergencyContacts: [EmergencyContactSchema],
    healthHistory: HealthHistorySchema,

}, { timestamps: true })

module.exports = mongoose.model('Patient', PatientSchema)