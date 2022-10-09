const mongoose = require('mongoose')
const cancelRegistrationValidation = require('../validations/cancelledRegistration')
const CancelledAttendanceModel = require('../models/CancelledAttendanceModel')
const CancelledRegistrationModel = require('../models/CancelledRegistrationModel')
const RegistrationModel = require('../models/RegistrationModel')
const StaffModel = require('../models/StaffModel')
const ClubModel = require('../models/ClubModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const PackageModel = require('../models/PackageModel')
const utils = require('../utils/utils')


const addCancelRegistration = async (request, response) => {

    try {

        const dataValidation = cancelRegistrationValidation.cancelledRegistrationData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { registrationId, staffId } = request.body

        const [registration, staff] = await Promise.all([
            RegistrationModel.findById(registrationId),
            StaffModel.findById(staffId)
        ])


        if(!registration) {
            return response.status(404).json({
                message: 'registration Id does not exists',
                field: 'registrationId'
            })
        }

        if(!staff) {
            return response.status(404).json({
                message: 'staff Id does not exists',
                field: 'staff'
            })
        }


        const currentDate = new Date()

        if(registration.expiresAt < currentDate) {
            return response.status(400).json({
                message: 'member registration has passed the expiry date',
                field: 'registrationId'
            })
        }

        const package = await PackageModel.findById(registration.packageId)

       if(package.attendance == 1 && (package.expiresIn == '1 day' || package.expiresIn == '1 days')) {
            
        const cancelRegistrationData = {
            clubId: registration.clubId,
            staffId,
            memberId: registration.memberId,
            packageId: registration.packageId,
            attended: registration.attended - 1,
            expiresAt: registration.expiresAt,
            paid: registration.paid,
            registrationDate: registration.createdAt
        }
        
        const cancelRegistrationObj = new CancelledRegistrationModel(cancelRegistrationData)

        const [cancelledRegistration, deletedRegistration] = await Promise.all([
            cancelRegistrationObj.save(),
            RegistrationModel.findByIdAndDelete(registrationId)
        ])


        return response.status(200).json({
            message: 'member registration is deleted successfully',
            cancelledRegistration: cancelledRegistration
        })

       }

       if(!registration.isActive) {
        return response.status(400).json({
            message: 'member registration is already expired',
            field: 'registrationId'
        })
    }


        const cancelRegistrationData = {
            clubId: registration.clubId,
            staffId,
            memberId: registration.memberId,
            packageId: registration.packageId,
            attended: registration.attended,
            expiresAt: registration.expiresAt,
            paid: registration.paid,
            registrationDate: registration.createdAt
        }

        const cancelRegistrationObj = new CancelledRegistrationModel(cancelRegistrationData)

        const [cancelledRegistration, deletedRegistration] = await Promise.all([
            cancelRegistrationObj.save(),
            RegistrationModel.findByIdAndDelete(registrationId)
        ])
        

        return response.status(200).json({
            message: 'member registration is cancelled successfully',
            cancelledRegistration: cancelledRegistration
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getCancelledRegistrations = async (request, response) => {

    try {

        const { clubId } = request.params

        if(!utils.isObjectId(clubId)) {
            return response.status(400).json({
                message: 'invalid club Id formate',
                field: 'clubId'
            })
        }

        const cancelledRegistrations = await CancelledRegistrationModel.aggregate([
            {
                $match: {
                    clubId: mongoose.Types.ObjectId(clubId)
                }
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $project: {
                    'member.canAuthenticate': 0,
                    'member.QRCodeURL': 0,
                    'member.updatedAt': 0,
                    'member.__v': 0,
                    'staff.password': 0,
                    'staff.updatedAt': 0,
                    'staff.__v': 0,
                    'package.updatedAt': 0,
                    'package.__v': 0,
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        cancelledRegistrations.forEach(registration => {
            registration.staff = registration.staff[0]
            registration.member = registration.member[0]
            registration.package = registration.package[0]

        })

        return response.status(200).json({
            cancelledRegistrations
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getCancelledRegistrationsByOwner = async (request, response) => {

    try {

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const cancelledRegistrations = await CancelledRegistrationModel.aggregate([
            {
                $match: {
                    clubId: { $in: clubs },
                }
            },
            {
                $lookup: {
                    from: 'clubs',
                    localField: 'clubId',
                    foreignField: '_id',
                    as: 'club'
                }
            },
            {
                $lookup: {
                    from: 'members',
                    localField: 'memberId',
                    foreignField: '_id',
                    as: 'member'
                }
            },
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            {
                $lookup: {
                    from: 'packages',
                    localField: 'packageId',
                    foreignField: '_id',
                    as: 'package'
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    password: 0,
                    updatedAt: 0,
                    __v: 0,
                    'club.updatedAt': 0,
                    'club.__v': 0
                }
            }
        ])

        cancelledRegistrations.forEach(cancelledRegistration => {
            cancelledRegistration.club = cancelledRegistration.club[0]
            cancelledRegistration.member = cancelledRegistration.member[0]
            cancelledRegistration.staff = cancelledRegistration.staff[0]
            cancelledRegistration.package = cancelledRegistration.package[0]
        })

        return response.status(200).json({
            cancelledRegistrations
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { 
    addCancelRegistration, 
    getCancelledRegistrations, 
    getCancelledRegistrationsByOwner 
}