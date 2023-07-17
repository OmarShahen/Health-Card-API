const mongoose = require('mongoose')
const { MedicineSchema } = require('./MedicineModel')


const PrescriptionSchema = new mongoose.Schema({

    prescriptionId: { type: Number, required: true },
    clinicId: { type: mongoose.Types.ObjectId, required: true },
    doctorId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    medicines: [MedicineSchema],
    notes: []

}, { timestamps: true })


module.exports = mongoose.model('Prescription', PrescriptionSchema)