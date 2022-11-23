const mongoose = require('mongoose')

const SportSchema = new mongoose.Schema({
    sport: { type: String, unique: true }
}, { timestamps: true })

module.exports = mongoose.model('Sports', SportSchema)