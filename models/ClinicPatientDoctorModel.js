const mongoose = require('mongoose')

const ClinicPatientDoctorSchema = new mongoose.Schema({

    clinicId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    doctorId: { type: mongoose.Types.ObjectId, required: true }

}, { timestamps: true })

module.exports = mongoose.model('ClinicPatientDoctor', ClinicPatientDoctorSchema)