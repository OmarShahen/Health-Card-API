const mongoose = require('mongoose')
const CountrySchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true },
    cities: []

}, { timestamps: true })

module.exports = mongoose.model('Country', CountrySchema)