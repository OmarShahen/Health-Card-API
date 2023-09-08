const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({

    clinicId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId },
    folderId: { type: mongoose.Types.ObjectId },
    creatorId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('File', FileSchema)