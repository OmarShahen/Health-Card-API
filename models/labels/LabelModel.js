const mongoose = require('mongoose')

const LabelSchema = new mongoose.Schema({

    name: { type: String, required: true, unique: true }

}, { timestamps: true })

module.exports = mongoose.model('label', LabelSchema)