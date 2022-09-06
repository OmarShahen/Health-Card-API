const mongoose = require('mongoose')
const CancelledAttendanceSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    registrationId: { type: mongoose.Types.ObjectId, required: true },
    packageId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: mongoose.Types.ObjectId, required: true },
    memberId: { type: mongoose.Types.ObjectId, required: true },

}, { timestamps: true })

module.exports = mongoose.model('CancelledAttendance', CancelledAttendanceSchema)