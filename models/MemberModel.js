const mongoose = require('mongoose')
const MemberSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true, },
    countryCode: { type: String, required: true },
    membership: { type: Number },
    cardBarcode: { type: String },
    gender: { type: String, required: true, enum: ['male', 'female']},
    birthYear: { type: String },
    address: { type: String },
    job: { type: String },
    sportType: { type: String },
    canAuthenticate: { type: Boolean, default: false },
    QRCodeURL: { type: String },
    QRCodeUUID: { type: String },
    isBlocked: { type: Boolean, default: false },
    isBlacklist: { type: Boolean, default: false },
    notes: [
        {
            noteMaker: { type: String },
            note: { type: String },
            createdAt: { type: Date }
        }
    ]

}, { timestamps: true })

MemberSchema.index({ name: 'text', email: 'text', phone: 'text' })

module.exports = mongoose.model('Member', MemberSchema)