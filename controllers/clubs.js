const config = require('../config/config')
const utils = require('../utils/utils')
const dateFNS = require('date-fns')
const mongoose = require('mongoose')
const ClubModel = require('../models/ClubModel')
const CountryModel = require('../models/countryModel')
const RegistrationModel = require('../models/RegistrationModel')
const AttendanceModel = require('../models/AttendanceModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const MemberModel = require('../models/MemberModel')
const CancelledAttendanceModel = require('../models/CancelledAttendanceModel')
const CancelledRegistrationModel = require('../models/CancelledRegistrationModel')
const FreezedRegistrationModel = require('../models/FreezeRegistrationModel')
const StaffModel = require('../models/StaffModel')
const clubValidation = require('../validations/clubs')
const statsValidation = require('../validations/stats')

const addClub = async (request, response) => {

    try {

        const dataValidation = clubValidation.clubData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field:  dataValidation.field
            })
        }

        const { ownerId, name, description, phone, countryCode } = request.body

        const owner = await ChainOwnerModel.findById(ownerId)

        if(!owner) {
            return response.status(404).json({
                message: 'owner Id does not exist',
                field: 'ownerId'
            })
        }

        const phoneList = await ClubModel
        .find({ phone, countryCode, ownerId: { $ne: ownerId } })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already registered',
                field: 'phone'
            })
        }

        let { country, city, address } = request.body.location

        country = country.toUpperCase()
        city = city.toUpperCase()

        const countriesList = await CountryModel.find({ name: country })

        if(countriesList.length == 0) {
            return response.status(400).json({
                message: 'country is not registered',
                field: 'location.country'
            })
        }

        const cities = countriesList[0].cities

        if(!cities.includes(city)) {
            return response.status(400).json({
                message: 'city is not registered',
                field: 'location.city'
            })
        }

        const clubsList = await ClubModel
        .find({ ownerId, name })

        const clubCode = `${name.toUpperCase()}-${clubsList.length + 1}.0`

        const club = {
            ownerId,
            name,
            description,
            clubCode,
            phone,
            countryCode,
            currency: countriesList[0].currency,
            location: { country, city, address },
        }

        const clubObj = new ClubModel(club)
        const newClub = await clubObj.save()

        const newClubId = newClub._id

        const updatedChainOwner = await ChainOwnerModel
        .findByIdAndUpdate(ownerId, { $push: { clubs: newClubId } }, { new: true } )

        updatedChainOwner.password = null

        return response.status(200).json({
            message: `${club.name} is added to our clubs network successfully!`,
            club: newClub,
            chainOwner: updatedChainOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { searchQuery, until, specific, to } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const growthQuery = utils.statsQueryGenerator('clubId', clubId, { until: growthUntilDate })

        const registrationsPromise = RegistrationModel.aggregate([
            {
                $match: searchQuery
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
                $sort: {
                    createdAt: -1
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
                    'package.__v': 0
                }
            }
        ])

        const attendancesPromise = AttendanceModel.find(searchQuery)

        const membersPromise = MemberModel.find(searchQuery)

        const registrationsGrowthStatsPromise = RegistrationModel.aggregate([
            {
                $match: growthQuery.searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const attendancesStatsHourPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%H', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])


        const [registrations, attendances, members, registrationsGrowthStats, attendancesStatsHour] = await Promise.all([
            registrationsPromise,
            attendancesPromise,
            membersPromise,
            registrationsGrowthStatsPromise,
            attendancesStatsHourPromise
        ])

        registrations.forEach(registration => {
            registration.staff = registration.staff[0]
            registration.member = registration.member[0]
            registration.package = registration.package[0]
        })

        attendancesStatsHour.forEach(hour => hour._id = Number.parseInt(hour._id))
        attendancesStatsHour
        .sort((hour1, hour2) => Number.parseInt(hour1._id) - Number.parseInt(hour2._id))


        const totalRegistrations = registrations.length
        const totalEarnings = utils.calculateRegistrationsTotalEarnings(registrations)
        const totalAttendances = attendances.length
        const totalMembers = members.length


        registrationsGrowthStats
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        return response.status(200).json({
            attendancesStatsHour,
            registrationsGrowthStats,
            totalRegistrations,
            totalAttendances,
            totalMembers,
            totalEarnings,
            registrations,
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubMainStatsByDate = async (request, response) => {

    try {

        const dataValidation = statsValidation.statsDates(request.query)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId } = request.params
        const { searchQuery, until, specific, to } = utils.statsQueryGenerator('clubId', clubId, request.query)

        const growthUntilDate = utils.growthDatePicker(until, to, specific)
        const growthQuery = utils.statsQueryGenerator('clubId', clubId, { until: growthUntilDate })

        const clubPromise = ClubModel.findById(clubId)

        const registrationsPromise = RegistrationModel.find(searchQuery)

        const attendancesPromise = AttendanceModel.find(searchQuery)

        const membersPromise = MemberModel.find(searchQuery)

        const registrationsGrowthStatsPromise = RegistrationModel.aggregate([
            {
                $match: growthQuery.searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])


        const [club, registrations, attendances, registrationsGrowthStats, members] = await Promise.all([
            clubPromise,
            registrationsPromise,
            attendancesPromise,
            registrationsGrowthStatsPromise,
            membersPromise
        ])

        const totalMembers = members.length
        const totalRegistrations = registrations.length
        const totalEarnings = utils.calculateRegistrationsTotalEarnings(registrations)
        const totalAttendances = attendances.length


        registrationsGrowthStats
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        return response.status(200).json({
            club,
            registrationsGrowthStats,
            totalRegistrations,
            totalAttendances,
            totalEarnings,
            totalMembers
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubs = async (request, response) => {

    try {

        let clubs = await ClubModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            clubs
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClubsByOwner = async (request, response) => {

    try {

        const { ownerId } = request.params

        const clubs = await ClubModel.find({ ownerId })

        return response.status(200).json({
            clubs
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateClub = async (request, response) => {

    try {

        const { clubId } = request.params

        const dataValidation = clubValidation.updateClubData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { description, phone, countryCode } = request.body

        const club = await ClubModel.findById(clubId)

        if(club.countryCode == club && club.phone != phone) {

            const phoneList = await ClubModel
            .find({ countryCode, phone })

            if(phoneList.length != 0) {
                return response.status(400).json({
                    message: 'phone is already registered',
                    field: 'phone'
                })
            }
        }

        let clubData = { description, countryCode, phone }


        const updatedClub = await ClubModel
        .findByIdAndUpdate(
            clubId,
            clubData,
            { new: true }
        )

        return response.status(200).json({
            message: 'club data updated successfully',
            club: updatedClub
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateClubStatus = async (request, response) => {

    try {

        const { clubId } = request.params
        const { isActive } = request.body


        if(typeof isActive != 'boolean') {
            return response.status(400).json({
                message: 'club status must be boolean',
                field: 'isActive'
            })
        }

        const updatedClub = await ClubModel
        .findByIdAndUpdate(
            clubId,
            { isActive },
            { new: true }
        )


        return response.status(200).json({
            message: 'club status is updated successfully',
            club: updatedClub
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteClub = async (request, response) => {

    try {

        const { clubId } = request.params

        const clubStaffs = await StaffModel.find({ clubId })

        if(clubStaffs.length != 0) {
            return response.status(400).json({
                message: `club has ${clubStaffs.length} registered club`,
                field: 'clubId'
            })
        }

        const ownerList = await ChainOwnerModel.find({ 'clubs': mongoose.Types.ObjectId(clubId) })
        const owner = ownerList[0]

        owner.clubs = owner.clubs.filter(club => clubId != club)

        const updateOwner = await ChainOwnerModel.findByIdAndUpdate(owner._id, { clubs: owner.clubs })

        const deletedClub = await ClubModel.findByIdAndDelete(clubId)

        return response.status(200).json({
            club: deletedClub
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteClubAndRelated = async (request, response) => {

    try {

        const { clubId } = request.params

        const ownerList = await ChainOwnerModel.find({ 'clubs': mongoose.Types.ObjectId(clubId) })
        const owner = ownerList[0]

        owner.clubs = owner.clubs.filter(club => clubId != club)

        const updateOwnerPromise = ChainOwnerModel.findByIdAndUpdate(owner._id, { clubs: owner.clubs })

        const deleteStaffsPromise = StaffModel.deleteMany({ clubId })

        const deleteMembersPromise = MemberModel.deleteMany({ clubId })

        const deleteAttendancesPromise = AttendanceModel.deleteMany({ clubId })

        const deleteRegistrationsPromise = RegistrationModel.deleteMany({ clubId })

        const deleteCancelledAttendancesPromise = CancelledAttendanceModel.deleteMany({ clubId })

        const deleteCancelledRegistrationsPromise = CancelledRegistrationModel.deleteMany({ clubId })

        const deleteFreezedRegistrationsPromise = FreezedRegistrationModel.deleteMany({ clubId })

        const deletedClubPromise = ClubModel.findByIdAndDelete(clubId)

        const [
            updateOwner,
            deletedStaffs,
            deletedMembers,
            deletedAttendances,
            deletedRegistrations,
            deletedCancelledAttendances,
            deletedCancelledRegistrations,
            deletedFreezedRegistrations,
            deletedClub

        ] = await Promise.all([
            updateOwnerPromise,
            deleteStaffsPromise,
            deleteMembersPromise,
            deleteAttendancesPromise,
            deleteRegistrationsPromise,
            deleteCancelledAttendancesPromise,
            deleteCancelledRegistrationsPromise,
            deleteFreezedRegistrationsPromise,
            deletedClubPromise
        ])


        return response.status(200).json({
            message: 'club deleted successfully and all related data',
            club: deletedClub,
            deletedStaffs: deletedStaffs.deletedCount,
            deletedMembers: deletedMembers.deletedCount,
            deletedAttendances: deletedAttendances.deletedCount,
            deletedRegistrations: deletedRegistrations.deletedCount,
            deletedCancelledAttendances: deletedCancelledAttendances.deletedCount,
            deletedCancelledRegistrations: deletedCancelledRegistrations.deletedCount,
            deletedFreezedRegistrations: deletedFreezedRegistrations.deletedCount,
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
    addClub, 
    getClubStatsByDate, 
    getClubs, 
    getClubsByOwner, 
    updateClub,
    updateClubStatus,
    deleteClub,
    deleteClubAndRelated,
    getClubMainStatsByDate
}