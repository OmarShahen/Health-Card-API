const mongoose = require('mongoose')

const ClubSchema = new mongoose.Schema({

    name: { type: String, required: true },
    imageURL: { type: String },
    phone: { type: String, required: true },
    countryCode: { type: String, required: true },
    location:{
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number }
    },

}, { timestamps: true })

ClubSchema.index({ name: 'text', phone: 'text' })

module.exports = mongoose.model('Club', ClubSchema)