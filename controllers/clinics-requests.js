const ClinicRequestModel = require('../models/ClinicRequestModel')
const ClinicModel = require('../models/ClinicModel')
const UserModel = require('../models/UserModel')
const clinicRequestValidation = require('../validations/clinics-requests')
const ClinicDoctorModel = require('../models/ClinicDoctorModel')
const mongoose = require('mongoose')

const addClinicRequest = async (request, response) => {

    try {

        const dataValidation = clinicRequestValidation.addClinicRequest(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId, userId } = request.body

        const clinicPromise = ClinicModel.findById(clinicId)
        const userPromise = UserModel.findById(userId)

        const [clinic, user] =await Promise.all([clinicPromise, userPromise])

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id is not registered',
                field: 'clinicId'
            })
        }

        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'user Id is not registered',
                field: 'userId'
            })
        }

        const clinicRequestList = await ClinicRequestModel.find({ clinicId, userId })
        if(clinicRequestList.length > 0) {
            const clinicRequest = clinicRequestList[0]
            if(clinicRequest.status == 'ACCEPTED') {
                return response.status(400).json({
                    accepted: false,
                    message: 'clinic request is already accepted',
                    field: 'clinicId'
                })
            }

            if(clinicRequest.status == 'PENDING') {
                return response.status(400).json({
                    accepted: false,
                    message: 'clinic request is already pending',
                    field: 'clinicId'
                })
            }
        }

        const clinicRequestData = { clinicId, userId }
        const clinicRequestObj = new ClinicRequestModel(clinicRequestData)
        const newClinicRequest = await clinicRequestObj.save()


        return response.status(200).json({
            accepted: true,
            message: 'clinic request is registered successfully!',
            clinicRequest: newClinicRequest
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

const getClinicsRequests = async (request, response) => {

    try {

        const clinicRequestList = await ClinicRequestModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
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

const getClinicsRequestsByUserId = async (request, response) => {

    try {

        const { userId } = request.params

        const clinicRequestList = await ClinicRequestModel.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'user.password': 0
                }
            }
        ])

        clinicRequestList.forEach(clinicRequest => {
            clinicRequest.user = clinicRequest.user[0]
            clinicRequest.clinic = clinicRequest.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
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

const getClinicsRequestsByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const clinicRequestList = await ClinicRequestModel.aggregate([
            {
                $match: {
                    clinicId: mongoose.Types.ObjectId(clinicId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
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
                $sort: {
                    createdAt: -1
                }
            },
            {
                $project: {
                    'user.password': 0
                }
            }
        ])

        clinicRequestList.forEach(clinicRequest => {
            clinicRequest.user = clinicRequest.user[0]
            clinicRequest.clinic = clinicRequest.clinic[0]
        })

        return response.status(200).json({
            accepted: true,
            clinicsRequests: clinicRequestList
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

const deleteClinicRequest = async (request, response) => {

    try {

        const { clinicRequestId } = request.params

        const deletedClinicRequest = await ClinicRequestModel.findByIdAndDelete(clinicRequestId)

        const { userId, clinicId } = deletedClinicRequest
        const deleteClinicDoctor = await ClinicDoctorModel.deleteOne({ clinicId, doctorId: userId })

        return response.status(200).json({
            accepted: true,
            clinicRequest: deletedClinicRequest,
            clinicDoctor: deleteClinicDoctor
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

const updateClinicRequestStatus = async (request, response) => {

    try {

        const { clinicRequestId } = request.params
        const { status } = request.body

        if(!status) {
            return response.status(400).json({
                accepted: false,
                message: 'status is required',
                field: 'status'
            })
        }

        if(!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid clinic request status',
                field: 'status'
            })
        }

        const clinicRequest = await ClinicRequestModel.findById(clinicRequestId)
        if(clinicRequest.status == status) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic request has already this status',
                field: 'status'
            })
        }

        if(status == 'ACCEPTED') {
            const { clinicId, userId } = clinicRequest
            const clinicDoctorList = await ClinicDoctorModel.find({ clinicId, doctorId: userId })
            if(clinicDoctorList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'doctor is already registered with the clinic',
                    field: 'status'
                })
            }

            const updateClinicRequestPromise = ClinicRequestModel
            .findByIdAndUpdate(clinicRequestId, { status }, { new: true })
            
            const clinicDoctorData = { clinicId, doctorId: userId }
            const clinicDoctorObj = new ClinicDoctorModel(clinicDoctorData)
            const newClinicDoctorPromise = clinicDoctorObj.save()

            const [updateClinicRequest, newClinicDoctor] = await Promise.all([updateClinicRequestPromise, newClinicDoctorPromise])

        }

        if(status == 'PENDING' || status == 'REJECTED') {
            const { clinicId, userId } = clinicRequest

            const updateClinicRequestPromise = ClinicRequestModel
            .findByIdAndUpdate(clinicRequestId, { status }, { new: true })
            const deleteClinicDoctorPromise = ClinicDoctorModel.deleteOne({ clinicId, doctorId: userId })

            const [updateClinicRequest, deleteClinicDoctor] = await Promise.all([updateClinicRequestPromise, deleteClinicDoctorPromise])
        }


        return response.status(200).json({
            accepted: true,
            message: 'updated clinic request status successfully!'
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
    addClinicRequest, 
    getClinicsRequests, 
    getClinicsRequestsByUserId,
    getClinicsRequestsByClinicId,
    deleteClinicRequest,
    updateClinicRequestStatus
}