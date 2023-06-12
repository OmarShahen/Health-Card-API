const mongoose = require('mongoose')

const EmailVerificationSchema = new mongoose.Schema({

    userId: { type: mongoose.Types.ObjectId, required: true },
    code: { type: Number, required: true },

}, { timestamps: true })

EmailVerificationSchema.index( { "createdAt": 1 }, { expireAfterSeconds: 120 } )

module.exports = mongoose.model('EmailVerification', EmailVerificationSchema)