const mongoose = require('mongoose')

const AttendanceSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    registrationId: { type: mongoose.Types.ObjectId, required: true },
    packageId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: mongoose.Types.ObjectId, required: true },
    memberId: { type: mongoose.Types.ObjectId, required: true },
    confirmationMethod: { type: String, default: 'MANUAL', enum: ['MANUAL', 'CARD', 'MESSAGE'] }

}, { timestamps: true })


module.exports = mongoose.model('Attendance', AttendanceSchema)