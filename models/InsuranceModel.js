const mongoose = require('mongoose')
const config = require('../config/config')

const InsuranceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    clinicId: { type: mongoose.Types.ObjectId, required: true }

}, { timestamps: true })

module.exports = mongoose.model('Insurance', InsuranceSchema)