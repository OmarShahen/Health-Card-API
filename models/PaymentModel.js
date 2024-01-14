const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({

    paymentId: { type: Number, required: true, unique: true },
    appointmentId: { type: mongoose.Types.ObjectId, required: true },
    expertId: { type: mongoose.Types.ObjectId, required: true },
    seekerId: { type: mongoose.Types.ObjectId, required: true },
    transactionId: { type: Number, required: true },
    success: { type: Boolean, required: true },
    pending: { type: Boolean, required: true },
    isRefunded: { type: Boolean, default: false },
    gateway: { type: String, required: true },
    orderId: { type: Number, required: true },
    amountCents: { type: Number, required: true },
    commission: { type: Number, required: true },
    currency: { type: String }

}, { timestamps: true })


module.exports = mongoose.model('Payment', PaymentSchema)