const mongoose = require('mongoose')

const FolderSchema = new mongoose.Schema({

    clinicId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId },
    parentFolderId: { type: mongoose.Types.ObjectId },
    creatorId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Folder', FolderSchema)