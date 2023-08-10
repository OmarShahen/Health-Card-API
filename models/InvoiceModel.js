const mongoose = require('mongoose')
const config = require('../config/config')

const InvoiceSchema = new mongoose.Schema({

    invoiceId: { type: Number, required: true },
    clinicId: { type: mongoose.Types.ObjectId, required: true },
    insuranceCompanyId: { type: mongoose.Types.ObjectId },
    insurancePolicyId: { type: mongoose.Types.ObjectId },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    totalCost: { type: Number, required: true, default: 0 },
    insuranceCoveragePercentage: { type: Number },
    paid: { type: Number, default: 0 },
    status: { type: String, required: true, enum: config.INVOICE_STATUS },
    paymentMethod: { type: String, enum: config.PAYMENT_METHOD },
    invoiceDate: { type: Date, default: new Date() },
    dueDate: { type: Date }

}, { timestamps: true })

module.exports = mongoose.model('Invoice', InvoiceSchema)