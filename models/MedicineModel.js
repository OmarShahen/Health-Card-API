const mongoose = require('mongoose')

const MedicineSchema = new mongoose.Schema({

    name: { type: String, required: true },
    instructions: [],
    dosage: {
        amount: { type: Number },
        unit: { type: String }
    },
    frequency: {
        number : { type: Number },
        timeUnit: { type: String }
    },
    duration: {
        number: { type: Number },
        timeUnit: { type: String }
    }  

}, { timestamps: true })

module.exports = { MedicineSchema }