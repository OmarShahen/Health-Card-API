const mongoose = require('mongoose')
const config = require('../config/config')

const PaymentSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    staffId: { type: mongoose.Types.ObjectId },
    staffIdPayroll: { type: mongoose.Types.ObjectId },
    type: { type: String, required: true, enum: ['EARN', 'DEDUCT'] },
    category: { type: String, required: true, enum: config.CLUB_PAYMENT_CATEGORIES },
    description: { type: String },
    amount: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    imageURL: { type: String },
    
}, { timestamps: true })

module.exports = mongoose.model('Payment', PaymentSchema)