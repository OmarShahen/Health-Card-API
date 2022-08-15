const mongoose = require('mongoose')
const MemberSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true, },
    phoneCountryCode: { type: String, required: true }

}, { timestamps: true })

MemberSchema.index({ name: 'text', email: 'text', phone: 'text' })

module.exports = mongoose.model('Member', MemberSchema)