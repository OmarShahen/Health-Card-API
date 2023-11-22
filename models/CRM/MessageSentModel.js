const mongoose = require('mongoose')

const MessageSentSchema = new mongoose.Schema({

    messageSentId: { type: Number, required: true },
    messageTemplateId: { type: mongoose.Types.ObjectId, required: true },
    leadId: { type: mongoose.Types.ObjectId, required: true },
    platform: { type: String, required: true },
    isOpened: { type: Boolean, required: true, default: false },
    openedDate: { type: Date },
    isResponded: { type: Boolean, required: true, default: false },
    respondedDate: { type: Date },
    isCTADone: { type: Boolean, required: true, default: false }

}, { timestamps: true })

module.exports = mongoose.model('MessageSent', MessageSentSchema)