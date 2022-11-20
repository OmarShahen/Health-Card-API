const mongoose = require('mongoose')
const NewsLetterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
}, { timestamps: true })

module.exports = mongoose.model('NewsLetter', NewsLetterSchema)