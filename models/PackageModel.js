const mongoose = require('mongoose')
const PackageSchmea = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    title: { type: String, required: true },
    attendance: { type: Number, required: true },
    expiresIn: { type: String, required: true },
    price: { type: Number, required: true },
    isOpen: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model('Package', PackageSchmea)