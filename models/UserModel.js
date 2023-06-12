const mongoose = require('mongoose')
const config = require('../config/config')

const UserSchema = new mongoose.Schema({

    clinicId: { type: mongoose.Types.ObjectId },
    userId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    email: { type: String, required: true },
    countryCode: { type: Number },
    phone: { type: Number },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: config.GENDER },
    dateOfBirth: { type: Date, required: true },
    speciality: [],
    role: { type: String, required: true, enum: ['DOCTOR', 'STAFF'] },
    isVerified: { type: Boolean, required: true, default: false }

}, { timestamps: true })


module.exports = mongoose.model('User', UserSchema)