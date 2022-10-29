const mongoose = require('mongoose')
const AdminSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true },
    role: { type: String, required: true, default: 'APP-ADMIN' }

}, { timestamps: true })

module.exports = mongoose.model('Admin', AdminSchema)