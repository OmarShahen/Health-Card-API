const mongoose = require('mongoose')
const InstallmentSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: mongoose.Types.ObjectId, required: true },
    memberId: { type: mongoose.Types.ObjectId, required: true },
    packageId: { type: mongoose.Types.ObjectId, required: true },
    registrationId: { type: mongoose.Types.ObjectId, required: true },
    paid: { type: Number, required: true },

}, { timestamps: true })

module.exports = mongoose.model('Installment', InstallmentSchema)