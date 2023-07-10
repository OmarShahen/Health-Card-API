const ClinicRequestModel = require('../models/ClinicRequestModel')
const ClinicModel = require('../models/ClinicModel')
const ClinicOwnerModel = require('../models/ClinicOwnerModel')
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

        const { clinicId, userId, role } = request.body

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

            if(clinicRequest.status == 'REJECTED') {
                return response.status(400).json({
                    accepted: false,
                    message: 'clinic request is already rejected',
                    field: 'clinicId'
                })
            }
        }

        const clinicRequestData = { clinicId, userId, role }
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

const addDoctorClinicRequestByReceiverEmail = async (request, response) => {

    try {

        const dataValidation = clinicRequestValidation.addClinicRequestByReceiverEmail(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId, email } = request.body

        const clinicPromise = ClinicModel.findById(clinicId)
        const userListPromise = UserModel.find({ email, isVerified: true })

        const [clinic, userList] =await Promise.all([clinicPromise, userListPromise])

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id is not registered',
                field: 'clinicId'
            })
        }

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'user email is not registered',
                field: 'email'
            })
        }

        const user = userList[0]
        const userId = user._id

        if(!user.roles.includes('DOCTOR')) {
            return response.status(400).json({
                accepted: false,
                message: 'cannot send request except for doctors',
                field: 'userId'
            })
        }

        const clinicDoctorList = await ClinicDoctorModel.find({ clinicId, doctorId: userId })
        if(clinicDoctorList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor is already registered in the clinic',
                field: 'userId'
            })
        }

        const clinicRequestList = await ClinicRequestModel.find({ clinicId, userId, role: 'DOCTOR' })
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

            if(clinicRequest.status == 'REJECTED') {
                return response.status(400).json({
                    accepted: false,
                    message: 'clinic request is already rejected',
                    field: 'clinicId'
                })
            }
        }


        const clinicRequestData = { clinicId, userId, role: 'DOCTOR' }
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

const addOwnerClinicRequestByReceiverEmail = async (request, response) => {

    try {

        const dataValidation = clinicRequestValidation.addClinicRequestByReceiverEmail(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clinicId, email } = request.body

        const clinicPromise = ClinicModel.findById(clinicId)
        const userListPromise = UserModel.find({ email, isVerified: true })

        const [clinic, userList] =await Promise.all([clinicPromise, userListPromise])

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id is not registered',
                field: 'clinicId'
            })
        }

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'user email is not registered',
                field: 'email'
            })
        }

        const user = userList[0]
        const userId = user._id

        if(!user.roles.includes('OWNER')) {
            return response.status(400).json({
                accepted: false,
                message: 'cannot send request except for owners',
                field: 'userId'
            })
        }

        const clinicOwnerList = await ClinicOwnerModel.find({ clinicId, ownerId: userId })
        if(clinicOwnerList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Owner is already registered in the clinic',
                field: 'userId'
            })
        }

        const clinicRequestList = await ClinicRequestModel.find({ clinicId, userId, role: 'OWNER' })
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

            if(clinicRequest.status == 'REJECTED') {
                return response.status(400).json({
                    accepted: false,
                    message: 'clinic request is already rejected',
                    field: 'clinicId'
                })
            }
        }

        const clinicRequestData = { clinicId, userId, role: 'OWNER' }
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

const addStaffClinicRequestByClinicId = async (request, response) => {

    try {

        const dataValidation = clinicRequestValidation.addStaffClinicRequestByClinicId(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        let { clinicId, userId } = request.body

        const clinicListPromise = ClinicModel.find({ clinicId })
        const userPromise = UserModel.findById(userId)

        const [clinicList, user] =await Promise.all([clinicListPromise, userPromise])

        if(clinicList.length == 0) {
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

        if(!user.roles.includes('STAFF')) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid user role type to perform this operation',
                field: 'userId'
            })
        }

        if(user.clinicId) {
            return response.status(400).json({
                accepted: false,
                message: 'user is already registered with a clinic',
                field: 'userId'
            })
        }

        const clinic = clinicList[0]
        clinicId = clinic._id

        const deleteOldClinicRequests = await ClinicRequestModel.deleteMany({ userId })

        const clinicRequestData = { clinicId, userId, role: 'STAFF' }
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

const getStaffsClinicsRequestsByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const clinicRequestList = await ClinicRequestModel.aggregate([
            {
                $match: {
                    clinicId: { $in: clinics },
                    role: 'STAFF'
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

const getDoctorsClinicsRequestsByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const clinicRequestList = await ClinicRequestModel.aggregate([
            {
                $match: {
                    clinicId: { $in: clinics },
                    role: 'DOCTOR'
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

const getOwnersClinicsRequestsByOwnerId = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const clinicRequestList = await ClinicRequestModel.aggregate([
            {
                $match: {
                    clinicId: { $in: clinics },
                    role: 'OWNER'
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

const getOwnerClinicsRequests = async (request, response) => {

    try {

        const { userId } = request.params

        const ownerClinics = await ClinicOwnerModel.find({ ownerId: userId })

        const clinics = ownerClinics.map(clinic => clinic.clinicId)

        const clinicRequestList = await ClinicRequestModel.aggregate([
            {
                $match: {
                    clinicId: { $in: clinics }
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

const getUserClinicRequestsWithStatus = async (request, response) => {

    try {

        const { userId, status } = request.params

        const clinicsRequests = await ClinicRequestModel.find({ userId, status })

        return response.status(200).json({
            accepted: true,
            clinicsRequests
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

const deleteStaffClinicRequest = async (request, response) => {

    try {

        const { clinicRequestId } = request.params

        const clinicRequest = await ClinicRequestModel.findById(clinicRequestId)

        if(clinicRequest.role != 'STAFF') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid request role',
                field: 'clinicRequestId'
            })
        }

        const { userId } = clinicRequest

        const deletedClinicRequestPromise = ClinicRequestModel.findByIdAndDelete(clinicRequestId)

        const updatedUserPromise = UserModel
        .findByIdAndUpdate(userId, { clinicId: null }, { new: true })

        const [deletedClinicRequest, updatedUser] = await Promise.all([
            deletedClinicRequestPromise,
            updatedUserPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'Deleted staff request successfully!',
            clinicRequest: deletedClinicRequest,
            user: updatedUser
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

const deleteDoctorClinicRequest = async (request, response) => {

    try {

        const { clinicRequestId } = request.params

        const clinicRequest = await ClinicRequestModel.findById(clinicRequestId)

        if(clinicRequest.role != 'DOCTOR') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid request role',
                field: 'clinicRequestId'
            })
        }

        const { userId, clinicId } = clinicRequest

        const deletedClinicRequestPromise = ClinicRequestModel.findByIdAndDelete(clinicRequestId)

        const deletedClinicDoctorPromise = ClinicDoctorModel.deleteOne({ clinicId, doctorId: userId })

        const [deletedClinicRequest, deletedClinicDoctor] = await Promise.all([
            deletedClinicRequestPromise,
            deletedClinicDoctorPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'Deleted doctor request successfully!',
            clinicRequest: deletedClinicRequest,
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

const deleteOwnerClinicRequest = async (request, response) => {

    try {

        const { clinicRequestId } = request.params

        const clinicRequest = await ClinicRequestModel.findById(clinicRequestId)

        if(clinicRequest.role != 'OWNER') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid request role',
                field: 'clinicRequestId'
            })
        }

        const { userId, clinicId } = clinicRequest

        const deletedClinicRequestPromise = ClinicRequestModel.findByIdAndDelete(clinicRequestId)

        const deletedClinicOwnerPromise = ClinicOwnerModel.deleteOne({ clinicId, ownerId: userId })

        const [deletedClinicRequest, deletedClinicOwner] = await Promise.all([
            deletedClinicRequestPromise,
            deletedClinicOwnerPromise
        ])

        return response.status(200).json({
            accepted: true,
            message: 'Deleted owner request successfully!',
            clinicRequest: deletedClinicRequest,
            clinicOwner: deletedClinicOwner
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

const updateDoctorClinicRequestStatus = async (request, response) => {

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

        if(clinicRequest.role != 'DOCTOR') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid request role',
                field: 'clinicRequestId'
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

const updateOwnerClinicRequestStatus = async (request, response) => {

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

        if(clinicRequest.role != 'OWNER') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid request role',
                field: 'clinicRequestId'
            })
        }

        if(status == 'ACCEPTED') {

            const { clinicId, userId } = clinicRequest
            const clinicOwnerList = await ClinicOwnerModel.find({ clinicId, ownerId: userId })
            if(clinicOwnerList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'owner is already registered with the clinic',
                    field: 'status'
                })
            }

            const updateClinicRequestPromise = ClinicRequestModel
            .findByIdAndUpdate(clinicRequestId, { status }, { new: true })
            
            const clinicOwnerData = { clinicId, ownerId: userId }
            const clinicOwnerObj = new ClinicOwnerModel(clinicOwnerData)
            const newClinicOwnerPromise = clinicOwnerObj.save()

            const [updateClinicRequest, newClinicOwner] = await Promise.all([updateClinicRequestPromise, newClinicOwnerPromise])

        }

        if(status == 'PENDING' || status == 'REJECTED') {
            const { clinicId, userId } = clinicRequest

            const updateClinicRequestPromise = ClinicRequestModel
            .findByIdAndUpdate(clinicRequestId, { status }, { new: true })
            const deleteClinicOwnerPromise = ClinicOwnerModel.deleteOne({ clinicId, ownerId: userId })

            const [updateClinicRequest, deleteClinicOwner] = await Promise.all([updateClinicRequestPromise, deleteClinicOwnerPromise])
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

const updateStaffClinicRequestStatus = async (request, response) => {

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

        if(clinicRequest.role != 'STAFF') {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid request role',
                field: 'clinicRequestId'
            })
        }

        if(status == 'ACCEPTED') {
            const { clinicId, userId } = clinicRequest
            
            const user = await UserModel.findById(userId)
            if(user.clinicId) {
                return response.status(400).json({
                    accepted: false,
                    message: 'user is already registered with a clinic',
                    field: 'userId'
                })
            }

            const updatedUserPromise = UserModel
            .findByIdAndUpdate(userId, { clinicId }, { new: true })

            const updateClinicRequestPromise = ClinicRequestModel
            .findByIdAndUpdate(clinicRequestId, { status }, { new: true })

            const [updateClinicRequest, updatedUser] = await Promise.all([updateClinicRequestPromise, updatedUserPromise])

        }

        if(status == 'PENDING' || status == 'REJECTED') {
            const { userId } = clinicRequest

            const updateClinicRequestPromise = ClinicRequestModel
            .findByIdAndUpdate(clinicRequestId, { status }, { new: true })

            const updatedUserPromise = UserModel
            .findByIdAndUpdate(userId, { clinicId: null }, { new: true })

            const [updateClinicRequest, updatedUser] = await Promise.all([updateClinicRequestPromise, updatedUserPromise])
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
    addDoctorClinicRequestByReceiverEmail,
    addOwnerClinicRequestByReceiverEmail,
    getClinicsRequests, 
    getClinicsRequestsByUserId,
    getClinicsRequestsByClinicId,
    getOwnerClinicsRequests,
    deleteStaffClinicRequest,
    deleteDoctorClinicRequest,
    deleteOwnerClinicRequest,
    updateDoctorClinicRequestStatus,
    updateStaffClinicRequestStatus,
    updateOwnerClinicRequestStatus,
    addStaffClinicRequestByClinicId,
    getStaffsClinicsRequestsByOwnerId,
    getDoctorsClinicsRequestsByOwnerId,
    getOwnersClinicsRequestsByOwnerId,
    getUserClinicRequestsWithStatus
}