const ClinicModel = require('../models/ClinicModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const UserModel = require('../models/UserModel')
const SpecialityModel = require('../models/SpecialityModel')
const CounterModel = require('../models/CounterModel')
const clinicValidation = require('../validations/clinics')
const mongoose = require('mongoose')
const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const ClinicPatientModel = require('../models/ClinicPatientModel')


const addClinic = async (request, response) => {

    try {

        const dataValidation = clinicValidation.addClinic(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { ownerId, name, countryCode, phone, speciality, city, country, address } = request.body

        const owner = await UserModel.findById(ownerId)
        if(!owner) {
            return response.status(400).json({
                accepted: false,
                message: 'Owner Id does not exist',
                field: 'ownerId'
            })
        }

        const phoneList = await ClinicModel.find({ countryCode, phone })
        if(phoneList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Phone is already registered',
                field: 'phone'
            })
        }

        const specialitiesList = await SpecialityModel.find({ _id: { $in: speciality } })

        if(specialitiesList.length != speciality.length) {
            return response.status(400).json({
                accepted: false,
                message: 'not registered specialities',
                field: 'speciality'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'clinic' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const clinicData = {
            clinicId: counter.value,
            ownerId,
            speciality,
            name,
            countryCode,
            phone,
            city,
            country,
            address
        }
        const clinicObj = new ClinicModel(clinicData)
        const newClinic = await clinicObj.save()

        const clinicOwnerData = { ownerId, clinicId: newClinic._id }
        const clinicOwnercObj = new ClinicOwnerModel(clinicOwnerData)
        const newClinicOwner = await clinicOwnercObj.save()
        
        return response.status(200).json({
            accepted: true,
            message: 'Added clinic successfully!',
            clinic: newClinic,
            clinicOwner: newClinicOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClinics = async (request, response) => {

    try {

        const clinics = await ClinicModel.aggregate([
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'specialitiesTest'
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            clinics
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClinicsByDoctorId = async (request, response) => {

    try {

        const { doctorId } = request.params

        const clinics = await ClinicDoctorModel.aggregate([
            {
                $match: {
                    doctorId: mongoose.Types.ObjectId(doctorId)
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        clinics.forEach(clinic => {
            clinic.clinic = clinic.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            clinics
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClinicsByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const clinics = await ClinicPatientModel.aggregate([
            {
                $match: {
                    patientId: mongoose.Types.ObjectId(patientId)
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        clinics.forEach(clinic => {
            clinic.clinic = clinic.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            clinics
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addClinic, getClinics, getClinicsByDoctorId, getClinicsByPatientId }