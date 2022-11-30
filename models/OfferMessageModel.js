const mongoose = require('mongoose')
const OfferMessageSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    language: { type: String, required: true, enum: ['ar', 'en'] }

}, { timestamps: true })

module.exports = mongoose.model('OfferMessage', OfferMessageSchema)
