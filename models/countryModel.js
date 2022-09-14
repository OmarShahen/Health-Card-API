const mongoose = require('mongoose')
const CountrySchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    cities: []

}, { timestamps: true })

module.exports = mongoose.model('Country', CountrySchema)