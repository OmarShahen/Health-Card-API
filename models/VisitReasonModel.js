const mongoose = require('mongoose')

const VisitReasonSchema = new mongoose.Schema({

    visitReasonId: { type: Number, required: true, unique: true },
    name: {type: String, required: true, unique: true },
    description: { type: String },

}, { timestamps: true })

module.exports = mongoose.model('VisitReason', VisitReasonSchema)