const mongoose = require('mongoose')
//const { PrescriptionSchema } = require('./PrescriptionModel')

const EncounterSchema = new mongoose.Schema({

    doctorId: { type: mongoose.Types.ObjectId, required: true },
    patientId: { type: mongoose.Types.ObjectId, required: true },
    symptoms: [],
    diagnosis: [],
    notes: [],
    labTests: [],
    labAnalysis: [],
    //prescription: PrescriptionSchema
    
}, { timestamps: true })

module.exports = mongoose.model('Encounter', EncounterSchema)