const mongoose = require('mongoose')
const SupplierSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    countryCode: { type: Number, required: true },
    description: { type: String, required: true }
    
}, { timestamps: true })

module.exports = mongoose.model('Supplier', SupplierSchema)