const mongoose = require('mongoose')
const FreezeRegistrationSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true  },
    staffId: { type: mongoose.Types.ObjectId, required: true },
    memberId: { type: mongoose.Types.ObjectId, required: true },
    registrationId: { type: mongoose.Types.ObjectId, required: true },
    packageId: { type: mongoose.Types.ObjectId, required: true },
    reactivationDate: { type: Date, required: true },
    freezeDuration: { type: String, required: true },
    registrationNewExpirationDate: { type: Date, required: true },
    reactivation: {
        staffId: { type: mongoose.Types.ObjectId },
        reactivationDate: { type: Date }
    }

}, { timestamps: true })

module.exports = mongoose.model('FreezeRegistration', FreezeRegistrationSchema)