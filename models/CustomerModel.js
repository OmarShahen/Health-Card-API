const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({

    customerId: { type: Number, required: true },
    seekerId: { type: mongoose.Types.ObjectId, required: true },
    expertId: { type: mongoose.Types.ObjectId, required: true }  

}, { timestamps: true })

module.exports = mongoose.model('Customer', CustomerSchema)