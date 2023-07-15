const mongoose = require('mongoose')

const ClinicOwnerSchema = new mongoose.Schema({

    clinicId: { type: mongoose.Types.ObjectId, required: true },
    ownerId: { type: mongoose.Types.ObjectId, required: true },
    isCreator: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('ClinicOwner', ClinicOwnerSchema)