const mongoose = require('mongoose')
const { MedicineSchema } = require('./MedicineModel')


const PrescriptionSchema = new mongoose.Schema({

    prescriptionId: { type: Number, required: true },
    clinicId: { type: mongoose.Types.ObjectId, required: true },
    doctorId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    medicines: [MedicineSchema],
    treatmentEndDate: { type: Date },
    notes: [],
    survey: {
        isDone: { type: Boolean, default: false },
        doneById: { type: mongoose.Types.ObjectId },
        doneDate: { type: Date }
    }

}, { timestamps: true })


module.exports = mongoose.model('Prescription', PrescriptionSchema)