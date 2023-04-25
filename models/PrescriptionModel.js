const mongoose = require('mongoose')
const { MedicineSchema } = require('./MedicineModel')


const PrescriptionSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    medicines: [MedicineSchema],
}, { timestamps: true })

module.exports = mongoose.model('Prescription', PrescriptionSchema)