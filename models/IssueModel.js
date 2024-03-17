const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({

    issueId: { type: Number, required: true },
    name: { type: String, unique: true, required: true },
    specialityId: { type: mongoose.Types.ObjectId, required: true }

}, { timestamps: true })


module.exports = mongoose.model('Issue', IssueSchema)