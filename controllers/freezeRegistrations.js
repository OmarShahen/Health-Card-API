const mongoose = require('mongoose')
const RegistrationModel = require('../models/RegistrationModel')
const PackageModel = require('../models/PackageModel')
const FreezeRegistrationModel = require('../models/FreezeRegistrationModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const freezeRegistrationValidation = require('../validations/freezeRegistration')
const utils = require('../utils/utils')

const addFreezeRegistration = async (request, response) => {

    try {

        const dataValidation = freezeRegistrationValidation.freezeData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { registrationId, staffId, freezeDuration } = request.body
        const currentDate = new Date()

        const registration = await RegistrationModel.findById(registrationId)

        if(registration.isActive == false || currentDate > registration.expiresAt) {
            return response.status(400).json({
                message: 'member registration is expired',
                field: 'registrationId'
            })
        }


        if(registration.isFreezed) {
            return response.status(400).json({
                message: 'member registration is already freezed',
                field: 'registrationId'
            })
        }


        const registrationPackage = await PackageModel.findById(registration.packageId)
        const PACKAGE_DURATION = registrationPackage.expiresIn

        if(PACKAGE_DURATION == '1 day' || PACKAGE_DURATION == '1 days') {
            return response.status(400).json({
                message: 'can not freeze a registration with a daily package',
                field: 'registrationId'
            })
        }

        const newExpirationDate = utils.calculateExpirationDate(registration.expiresAt, freezeDuration)
        const registrationReactivationDate = utils.calculateExpirationDate(currentDate, freezeDuration)

        const newFreezeRegistrationData = {
            clubId: registration.clubId,
            staffId,
            memberId: registration.memberId,
            registrationId: registration._id,
            packageId: registration.packageId,
            freezeDuration,
            registrationNewExpirationDate: newExpirationDate,
            reactivationDate: registrationReactivationDate
        }

        const updatedRegistrationPrmoise = RegistrationModel
        .findByIdAndUpdate(
            registrationId,
            { isFreezed: true, expiresAt: newExpirationDate },
            { new: true }
        )

        const freezeRegistrationObj = new FreezeRegistrationModel(newFreezeRegistrationData) 

        const [updatedRegistration, newFreezedRegistration] = await Promise.all([
            updatedRegistrationPrmoise,
            freezeRegistrationObj.save()
        ])

        return response.status(200).json({
            freezedRegistration: newFreezedRegistration,
            registration: updatedRegistration
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubFreezedRegistrations = async (request, response) => {

    try {

        const { clubId } = request.params

        const freezedRegistrations = await FreezeRegistrationModel.aggregate([
            {
                $match: {
                    clubId: mongoose.Types.ObjectId(clubId)
                }
            },
            {
                $lookup: {
                    from: 'registrations',
                    localField: 'registrationId',
                    foreignField: '_id',
                    as: 'registration'
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
                    localField: 'reactivation.staffId',
                    foreignField: '_id',
                    as: 'activator'
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
                    'activator.password': 0,
                    'activator.updatedAt': 0,
                    'staff.__v': 0,
                    'package.updatedAt': 0,
                    'package.__v': 0,
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])

        return response.status(200).json({
            freezedRegistrations
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const reactivateRegistration = async (request, response) => {

    try {

        const dataValidation = freezeRegistrationValidation.reactivateRegistrationData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { registrationId } = request.params
        const { staffId } = request.body
        const currentDate = new Date()

        const registration = await RegistrationModel.findById(registrationId)

        if(!registration.isFreezed) {
            return response.status(400).json({
                message: 'registration is already activated',
                field: 'registrationId'
            })
        }

        const freezedRegistrations = await FreezeRegistrationModel
        .find({ registrationId })
        .sort({ createdAt: -1 })

        if(freezedRegistrations.length == 0) {
            return response.status(404).json({
                message: 'registration has not been freezed',
                field: 'registrationId'
            })
        }

        const freezedRegistration = freezedRegistrations[0]

        if(currentDate >= freezedRegistration.reactivationDate) {

            const updateRegistrationPromise = RegistrationModel
            .findByIdAndUpdate(registrationId, { isFreezed: false }, { new: true })

            const updateFreezedRegistrationPromise = FreezeRegistrationModel
            .findByIdAndUpdate(freezedRegistration._id, { reactivation: {
                staffId,
                reactivationDate: currentDate
            } }, { new: true })

            const [updateRegistration, updateFreezedRegistration] = await Promise.all([
                updateRegistrationPromise,
                updateFreezedRegistrationPromise
            ])

            return response.status(200).json({
                freezedRegistration: updateFreezedRegistration,
                registration: updateRegistration
            })
        }

        const remainigPeriodInMilliSeconds = Math.abs(freezedRegistration.reactivationDate - currentDate)
        const remainigPeriodInSeconds = remainigPeriodInMilliSeconds / 1000
        const remainigPeriodInDays = remainigPeriodInSeconds / 86400

        const registrationExpirationDate = registration.expiresAt
        registrationExpirationDate.setDate(registrationExpirationDate.getDate() - remainigPeriodInDays)

        const updateRegistrationPromise = RegistrationModel
            .findByIdAndUpdate(registrationId, { isFreezed: false, expiresAt: registrationExpirationDate }, { new: true })

            const updateFreezedRegistrationPromise = FreezeRegistrationModel
            .findByIdAndUpdate(freezedRegistration._id, { reactivation: {
                staffId,
                reactivationDate: currentDate
            } }, { new: true })

            const [updateRegistration, updateFreezedRegistration] = await Promise.all([
                updateRegistrationPromise,
                updateFreezedRegistrationPromise
            ])


            return response.status(200).json({
                freezedRegistration: updateFreezedRegistration,
                registration: updateRegistration
            })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getFreezeRegistrationsByOwner = async (request, response) => {

    try {

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const freezedRegistrations = await FreezeRegistrationModel.aggregate([
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
                    from: 'staffs',
                    localField: 'reactivation.staffId',
                    foreignField: '_id',
                    as: 'activator'
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
                $lookup: {
                    from: 'registrations',
                    localField: 'registrationId',
                    foreignField: '_id',
                    as: 'registration'
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

        freezedRegistrations.forEach(freezedRegistration => {
            freezedRegistration.club = freezedRegistration.club[0]
            freezedRegistration.staff = freezedRegistration.staff[0]
            freezedRegistration.member = freezedRegistration.member[0]
            freezedRegistration.package = freezedRegistration.package[0]
            freezedRegistration.registration = freezedRegistration.registration[0]
            freezedRegistration.activator = freezedRegistration.activator[0] || null
        })

        return response.status(200).json({
            freezedRegistrations
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
    addFreezeRegistration, 
    getClubFreezedRegistrations, 
    reactivateRegistration,
    getFreezeRegistrationsByOwner
}