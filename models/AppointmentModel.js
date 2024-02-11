const mongoose = require('mongoose')
const config = require('../config/config')

const AppointmentSchema = new mongoose.Schema({

    appointmentId: { type: Number },
    seekerId: { type: mongoose.Types.ObjectId, required: true },
    expertId: { type: mongoose.Types.ObjectId, required: true },
    paymentId: { type: mongoose.Types.ObjectId },
    serviceId: { type: mongoose.Types.ObjectId, required: true },
    roomId: { type: String },
    isPaid: { type: Boolean, default: false },
    duration: { type: Number },
    price: { type: Number, default: 0 },
    status: { type: String, default: 'UPCOMING', enum: config.APPOINTMENT_STATUS },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    meetingLink: { type: String }

}, { timestamps: true })


module.exports = mongoose.model('Appointment', AppointmentSchema)