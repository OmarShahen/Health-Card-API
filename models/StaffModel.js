const mongoose = require('mongoose')
const StaffSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    countryCode: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['STAFF', 'OWNER'] },
    isAccountActive: { type: Boolean, default: true }

}, { timestamps: true })

StaffSchema.index({ name: 'text', email: 'text', phone: 'text' })

module.exports = mongoose.model('Staff', StaffSchema)