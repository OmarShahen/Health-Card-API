const mongoose = require('mongoose')
const ChainOwnerSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    countryCode: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, role: 'OWNER' },
    clubs: [],
    isAccountActive: { type: Boolean, default: true }

}, { timestamps: true })

ChainOwnerSchema.index({ name: 'text', email: 'text', phone: 'text' })

module.exports = mongoose.model('ChainOwner', ChainOwnerSchema)