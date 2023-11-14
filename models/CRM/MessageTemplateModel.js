const mongoose = require('mongoose')

const MessageTemplateSchema = new mongoose.Schema({

    messageTemplateId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }

}, { timestamps: true })

module.exports = mongoose.model('MessageTemplate', MessageTemplateSchema)