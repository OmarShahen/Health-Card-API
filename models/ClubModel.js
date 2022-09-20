const mongoose = require('mongoose')

const ClubSchema = new mongoose.Schema({

    ownerId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    clubCode: { type: String, required: true },
    imageURL: { type: String },
    phone: { type: String, required: true },
    countryCode: { type: String, required: true },
    currency: { type: String, required: true },
    location:{
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    isActive: { type: Boolean, default: true }

}, { timestamps: true })

ClubSchema.index({ name: 'text', phone: 'text' })

module.exports = mongoose.model('Club', ClubSchema)