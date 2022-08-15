const mongoose = require('mongoose')
const CancelledRegistrationSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true  },
    staffId: { type: mongoose.Types.ObjectId, required: true },
    memberId: { type: mongoose.Types.ObjectId, required: true },
    packageId: { type: mongoose.Types.ObjectId, required: true },
    attended: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    paid: { type: Number, required: true },
    registrationDate: { type: Date, required: true }

}, { timestamps: true })

module.exports = mongoose.model('CancelledRegistration', CancelledRegistrationSchema)