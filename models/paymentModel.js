const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({

    clubId: { type: mongoose.Types.ObjectId, required: true },
    type: { type: String, required: true, enum: ['EARN', 'DEDUCT'] },
    description: { type: String, required: true },
    amount: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    
}, { timestamps: true })

module.exports = mongoose.model('Payment', PaymentSchema)