const mongoose = require('mongoose')

const EmergencyContactSchema = new mongoose.Schema({

    name: { type: String },
    relation: { type: String },
    countryCode: { type: Number },
    phone: { type: Number }
    

}, { timestamps: true })

module.exports = { EmergencyContactSchema }