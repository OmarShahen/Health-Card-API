const mongoose = require('mongoose')
const config = require('../config/config')

const OpeningTimeSchema = new mongoose.Schema({

    openingTimeId: { type: Number, required: true },
    clinicId: { type: mongoose.Types.ObjectId },
    leadId: { type: mongoose.Types.ObjectId },
    weekday: { type: String, required: true, enum: config.WEEK_DAYS },
    openingTime: {
        hour: { type: Number, required: true },
        minute: { type: Number, required: true }
    },
    closingTime: {
        hour: { type: Number, required: true },
        minute: { type: Number, required: true }
    }

}, { timestamps: true })


module.exports = mongoose.model('OpeningTime', OpeningTimeSchema)