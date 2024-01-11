const mongoose = require('mongoose')
const config = require('../config/config')

const ClinicSchema = new mongoose.Schema({

    clinicId: { type: Number, required: true, unique: true },
    mode: { type: String, enum: config.CLINIC_MODES },
    name: { type: String, required: true },
    phone: { type: Number },
    countryCode: { type: Number },
    notificationCountryCode: { type: Number },
    notificationPhone: { type: Number },
    speciality: [],
    subSpeciality: [],
    city: { type: String, required: true },
    country: { type: String, required: true },
    county: { type: String, required: true },
    address: { type: String, required: true },
    activeUntilDate: { type: Date }

}, { timestamps: true })

module.exports = mongoose.model('Clinic', ClinicSchema)