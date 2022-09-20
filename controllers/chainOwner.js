const chainOwnerValidation = require('../validations/chainOwner')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')
const AttendanceModel = require('../models/AttendanceModel')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const statsValidation = require('../validations/stats')
const utils = require('../utils/utils')

const addChainOwner = async (request, response) => {

    try {

        const dataValidation = chainOwnerValidation.chainOwnerData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, email, phone, countryCode, password } = request.body


        const emailList = await ChainOwnerModel.find({ email })

        if(emailList.length != 0) {
            return response.status(400).json({
                message: 'email is already registered',
                field: 'email'
            })
        }

        const phoneList = await ChainOwnerModel.find({ phone, countryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already registered',
                field: 'phone'
            })
        }

        const chainOwner = {
            name,
            email,
            phone,
            countryCode,
            password: bcrypt.hashSync(password, config.SALT_ROUNDS),
        }       

        const newChainOwnerObj = new ChainOwnerModel(chainOwner)
        const newChainOwner = await newChainOwnerObj.save()

        newChainOwner.password = null

        return response.status(200).json({
            message: `${name} is added successfully as chain owner in Barbells`,
            newChainOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getChainOwners = async (request, response) => {

    try {

        const chainOwners = await ChainOwnerModel
        .find()
        .select({ password: 0, __v: 0, updatedAt: 0 })
        .sort({ createdAt: -1 })

        return response.status(200).json({
            chainOwners
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateChainOwner = async (request, response) => {

    try {

        const { ownerId } = request.params

        const dataValidation = chainOwnerValidation.updateChainOwnerData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, email, phone, countryCode } = request.body

        const owner = await ChainOwnerModel.findById(ownerId)

        if(email && owner.email != email) {

            const emailList = await ChainOwnerModel
            .find({ email })

            if(emailList.length != 0) {
                return response.status(400).json({
                    message: 'email is already registered',
                    field: 'email'
                })
            }
        }

        if(owner.countryCode == countryCode && owner.phone != phone) {

            const phoneList = await ChainOwnerModel
            .find({ countryCode, phone })

            if(phoneList.length != 0) {
                return response.status(400).json({
                    message: 'phone is already registered',
                    field: 'phone'
                })
            }
        }

        let ownerData = { name, countryCode, phone }

        if(email) ownerData = { ...ownerData, email }

        const updatedOwner = await ChainOwnerModel
        .findByIdAndUpdate(
            ownerId,
            ownerData,
            { new: true }
        )

        return response.status(200).json({
            message: 'chain owner updated successfully',
            owner: updatedOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateChainOwnerStatus = async (request, response) => {

    try {

        const { ownerId } = request.params
        const { isAccountActive } = request.body


        if(typeof isAccountActive != 'boolean') {
            return response.status(400).json({
                message: 'chain owner status must be boolean',
                field: 'isAccountActive'
            })
        }

        const updatedOwner = await ChainOwnerModel
        .findByIdAndUpdate(
            ownerId,
            { isAccountActive },
            { new: true }
        )


        return response.status(200).json({
            message: 'chain owner account status is updated successfully',
            owner: updatedOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteChainOwner = async (request, response) => {

    try {

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        if(owner.clubs.length != 0) {
            return response.status(400).json({
                message: `chain owner has ${owner.clubs.length} registered clubs`,
                field: 'ownerId'
            })
        }

        const deletedOwner = await ChainOwnerModel.findByIdAndDelete(ownerId)

        return response.status(200).json({
            owner: deletedOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteChainOwnerAndRelated = async (request, response) => {

    try {

        const { ownerId } = request.params

        const deletedClubs = await ClubModel
        .deleteMany({ ownerId })

        const deletedOwner = await ChainOwnerModel
        .findByIdAndDelete(ownerId)

        return response.status(200).json({
            message: 'chain owner deleted successfully and all related data',
            owner: deletedOwner,
            deletedClubs: deletedClubs.deletedCount
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getChainOwnerStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { ownerId } = request.params

        const owner = await ChainOwnerModel.findById(ownerId)

        const clubs = owner.clubs

        const { searchQuery } = utils.statsQueryGenerator('clubId', clubs, request.query)

        const registrationsPromise = RegistrationModel.find(searchQuery)

        const attendancesPromise = AttendanceModel.find(searchQuery)

        const registrationsStatsByMonthsPromise = RegistrationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const clubsQuery = utils.statsQueryGenerator('ownerId', ownerId, request.query)

        const ownerClubsPromise = ClubModel
        .find(clubsQuery.searchQuery)
        .sort({ createdAt: -1 })

        const [registrations, attendances, registrationsStatsByMonths, ownerClubs] = await Promise.all([
            registrationsPromise,
            attendancesPromise,
            registrationsStatsByMonthsPromise,
            ownerClubsPromise
        ])

        const totalRegistrations = registrations.length
        const totalEarnings = utils.calculateRegistrationsTotalEarnings(registrations)
        const totalAttendances = attendances.length

        registrationsStatsByMonths
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        return response.status(200).json({
            registrationsStatsByMonths,
            totalRegistrations,
            totalAttendances,
            totalEarnings,
            ownerClubs,
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
    addChainOwner, 
    getChainOwners, 
    updateChainOwner, 
    updateChainOwnerStatus,
    deleteChainOwner,
    deleteChainOwnerAndRelated,
    getChainOwnerStatsByDate
}