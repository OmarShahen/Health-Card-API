const mongoose = require('mongoose')
const RequestDemoSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true },
    clubName: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true }

}, { timestamps: true })

module.exports = mongoose.model('RequestDemo', RequestDemoSchema)