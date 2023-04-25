const mongoose = require('mongoose')
const config = require('../config/config')

const UserSchema = new mongoose.Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: config.GENDER },
    speciality: [],
    role: { type: String, required: true, enum: ['DOCTOR'] }

}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)