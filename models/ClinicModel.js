const mongoose = require('mongoose')

const ClinicSchema = new mongoose.Schema({

    name: { type: String, required: true },
    speciality: [],
    owners: [],
    city: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    longitude: { type: Number },
    latitude: { type: Number }

}, { timestamps: true })

module.exports = mongoose.model('Clinic', ClinicSchema)