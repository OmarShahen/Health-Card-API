const mongoose = require('mongoose')
const config = require('../../config/config')

const MeetingSchema = new mongoose.Schema({

    leadId: { type: mongoose.Types.ObjectId, required: true },
    status: { type: String, default: 'UPCOMING', enum: config.APPOINTMENT_STATUS },
    reservationTime: { type: Date, required: true },
    note: { type: String }

}, { timestamps: true })


module.exports = mongoose.model('Meeting', MeetingSchema)