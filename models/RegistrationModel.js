const mongoose = require('mongoose')
const RegistrationSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    memberId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: mongoose.Types.ObjectId, required: true },
    packageId: { type: mongoose.Types.ObjectId, required: true },
    isActive: { type: Boolean, default: true },
    attended: { type: Number, default: 0 },
    expiresAt: { type: Date },
    isFreezed: { type: Boolean, default: false },
    paid: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    isInstallment: { type: Boolean, default: false },
    isPaidFull: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model('Registration', RegistrationSchema)