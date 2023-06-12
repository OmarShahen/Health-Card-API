const mongoose = require('mongoose')

const SpecialitySchema = new mongoose.Schema({

    specialityId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },

}, { timestamps: true })

module.exports = mongoose.model('Speciality', SpecialitySchema)