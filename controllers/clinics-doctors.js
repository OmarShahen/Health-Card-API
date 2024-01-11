const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
const ClinicRequestModel = require('../models/ClinicRequestModel')
const UserModel = require('../models/UserModel')
const ClinicModel = require('../models/ClinicModel')
const clinicDoctorValidation = require('../validations/clinics-doctors')
const mongoose = require('mongoose')
const translations = require('../i18n/index')

const getClinicsDoctors = async (request, response) => {

    try {

        const clinicsDoctors = await ClinicDoctorModel.find()

        return response.status(200).json({
            accepted: true,
            clinicsDoctors
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

const getClinicsDoctorsByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const clinicsDoctors = await ClinicDoctorModel.aggregate([
            {
                $match: { clinicId: { $in: clinics } }
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
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'doctor.speciality',
                    foreignField: '_id',
                    as: 'specialities'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            }
        ])

        clinicsDoctors.forEach(clinicDoctor => {
            clinicDoctor.clinic = clinicDoctor.clinic[0]
            clinicDoctor.doctor = clinicDoctor.doctor[0]
        }) 

        return response.status(200).json({
            accepted: true,
            clinicsDoctors
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

const getClinicsDoctorsByDoctorId = async (request, response) => {

    try {

        const { userId } = request.params

        const clinicsDoctors = await ClinicDoctorModel.aggregate([
            {
                $match: { doctorId: mongoose.Types.ObjectId(userId) }
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
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            }
        ])

        clinicsDoctors.forEach(clinicDoctor => {
            clinicDoctor.clinic = clinicDoctor.clinic[0]
            clinicDoctor.doctor = clinicDoctor.doctor[0]
        }) 

        return response.status(200).json({
            accepted: true,
            clinicsDoctors
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

const getClinicsDoctorsByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const clinicsDoctors = await ClinicDoctorModel.aggregate([
            {
                $match: { clinicId: mongoose.Types.ObjectId(clinicId) }
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
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'doctor.speciality',
                    foreignField: '_id',
                    as: 'specialities'
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            }
        ])

        clinicsDoctors.forEach(clinicDoctor => {
            clinicDoctor.clinic = clinicDoctor.clinic[0]
            clinicDoctor.doctor = clinicDoctor.doctor[0]
        }) 

        return response.status(200).json({
            accepted: true,
            clinicsDoctors
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

const addClinicDoctor = async (request, response) => {

    try {

        const dataValidation = clinicDoctorValidation.addClinicDoctor(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { lang } = request.query
        const { doctorId, clinicId } = request.body

        const doctorPromise = UserModel.findById(doctorId)
        const clinicPromise = ClinicModel.findById(clinicId)

        const [doctor, clinic] = await Promise.all([doctorPromise, clinicPromise])

        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor Id does not exists',
                field: 'doctorId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id does not exists',
                field: 'clinicId'
            })
        } 

        const registeredClinicDoctorList = await ClinicDoctorModel.find({ doctorId, clinicId })
        if(registeredClinicDoctorList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Doctor is already registered with a clinic'],
                field: 'clinicId'
            })
        }

        const clinicDoctorData = { doctorId, clinicId }
        const clinicDoctorObj = new ClinicDoctorModel(clinicDoctorData)
        const newClinicDoctor = await clinicDoctorObj.save()


        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Registered doctor to clinic successfully!'],
            clinicDoctor: newClinicDoctor
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

const deleteClinicDoctor = async (request, response) => {

    try {

        const { lang } = request.query
        const { clinicDoctorId } = request.params

        const deletedClinicDoctor = await ClinicDoctorModel
        .findByIdAndDelete(clinicDoctorId)

        const { clinicId, doctorId } = deletedClinicDoctor

        const deletedClinicRequest = await ClinicRequestModel.deleteOne({ clinicId, userId: doctorId })

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted clinic doctor access successfully!'],
            clinicDoctor: deletedClinicDoctor,
            clinicRequest: deletedClinicRequest
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
    getClinicsDoctors, 
    getClinicsDoctorsByOwnerId, 
    getClinicsDoctorsByClinicId,
    getClinicsDoctorsByDoctorId,
    addClinicDoctor, 
    deleteClinicDoctor 
}