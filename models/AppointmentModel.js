const mongoose = require('mongoose')
const config = require('../config/config')

const AppointmentSchema = new mongoose.Schema({

    doctorId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId },
    patientName: { type: String, required: true },
    patientPhone: { type: Number, required: true },
    patientCountryCode: { type: Number, required: true },
    status: { type: String, default: 'UPCOMING', enum: config.APPOINTMENT_STATUS },
    reservationTime: { type: Date, required: true }

}, { timestamps: true })

module.exports = mongoose.model('Appointment', AppointmentSchema)