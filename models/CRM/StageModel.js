const mongoose = require('mongoose')

const StageSchema = new mongoose.Schema({

    stageId: { type: Number, required: true },
    leadId: { type: mongoose.Types.ObjectId, required: true },
    stage: { type: String, required: true },
    note: { type: String }

}, { timestamps: true })

module.exports = mongoose.model('Stage', StageSchema)