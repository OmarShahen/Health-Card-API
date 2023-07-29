const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const UserModel = require('../models/UserModel')
const ClinicModel = require('../models/ClinicModel')
const clinicOwnerValidation = require('../validations/clinics-owners')
const mongoose = require('mongoose')
const translations = require('../i18n/index')

const addClinicOwner = async (request, response) => {

    try {

        const dataValidation = clinicOwnerValidation.addClinicOwner(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { lang } = request.query
        const { ownerId, clinicId } = request.body

        const ownerPromise = UserModel.findById(ownerId)
        const clinicPromise = ClinicModel.findById(clinicId)

        const [owner, clinic] = await Promise.all([ownerPromise, clinicPromise])
        
        if(!owner) {
            return response.status(400).json({
                accepted: false,
                message: 'owner Id does not exist',
                field: 'ownerId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id does not exist',
                field: 'clinicId'
            })
        }

        const clinicOwnerList = await ClinicOwnerModel.find({ ownerId, clinicId })
        if(clinicOwnerList.length == 1) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Owner is already registered with the clinic'],
                field: 'ownerId'
            })
        }

        const clinicOwnerData = { ownerId, clinicId }
        const clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData)
        const newClinicOwner = await clinicOwnerObj.save()

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Added clinic owner successfully!'],
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

const getClinicsByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const clinics = await ClinicOwnerModel.aggregate([
            {
                $match: { ownerId: mongoose.Types.ObjectId(userId) }
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

        clinics.forEach(clinic => clinic.clinic = clinic.clinic[0])

        return response.status(200).json({
            accepted: false,
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

const getClinicsByOwnerIdWhichIsCreatedByOwner = async (request, response) => {

    try {

        const { userId } = request.params

        const clinics = await ClinicOwnerModel.aggregate([
            {
                $match: { ownerId: mongoose.Types.ObjectId(userId), isCreator: true }
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

        clinics.forEach(clinic => clinic.clinic = clinic.clinic[0])

        return response.status(200).json({
            accepted: false,
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

const deleteClinicOwner = async (request, response) => {

    try {

        const { lang } = request.query
        const { clinicOwnerId } = request.params

        const deletedClinicOwner = await ClinicOwnerModel.findByIdAndDelete(clinicOwnerId)

        const { ownerId, clinicId } = deletedClinicOwner

        const deletedClinicDoctor = await ClinicDoctorModel.deleteOne({ doctorId: ownerId, clinicId })

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic owner successfully!'],
            clinicOwner: deletedClinicOwner,
            clinicDoctor: deletedClinicDoctor
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

module.exports = { 
    addClinicOwner, 
    deleteClinicOwner, 
    getClinicsByOwnerId, 
    getClinicsByOwnerIdWhichIsCreatedByOwner 
}