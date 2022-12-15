const utils = require('../utils/utils')
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
const PaymentModel = require('../models/paymentModel')
const PackageModel = require('../models/PackageModel')
const StaffModel = require('../models/StaffModel')
const clubValidation = require('../validations/clubs')
const statsValidation = require('../validations/stats')
const translations = require('../i18n/index')

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

        const clubsListPromise = ClubModel.find({ ownerId, name })
        const clubsTotalPromise = ClubModel.countDocuments()

        const [clubsList, clubsTotal] = await Promise.all([
            clubsListPromise,
            clubsTotalPromise
        ])

        const clubCode = `${name.toUpperCase()}-${clubsList.length + 1}.0`
        const clubHumanId = clubsTotal + 1
        const clubCurrency = countriesList[0].currency

        const club = {
            Id: clubHumanId,
            ownerId,
            name,
            description,
            clubCode,
            phone,
            countryCode,
            currency: clubCurrency,
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

const updateClubImage = async (request, response) => {

    try {

        const { clubId } = request.params
        const { image } = request.body

        const dataValidation = clubValidation.updateClubImage(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const updatedClub = await ClubModel.findByIdAndUpdate(clubId, { image }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'updated club image successfully',
            club: updatedClub,
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

        const paymentsPromise = PaymentModel.find(searchQuery)


        const [registrations, attendances, members, registrationsGrowthStats, attendancesStatsHour, payments] = await Promise.all([
            registrationsPromise,
            attendancesPromise,
            membersPromise,
            registrationsGrowthStatsPromise,
            attendancesStatsHourPromise,
            paymentsPromise
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
        const totalRegistrationsEarnings = utils.calculateRegistrationsTotalEarnings(registrations)
        const totalAttendances = attendances.length
        const totalMembers = members.length
        const totalEarnings = totalRegistrationsEarnings
        //const totalDeductions = utils.calculateTotalPaymentsByType(payments, 'DEDUCT')
        //const netProfit = totalEarnings - totalDeductions

        //const allPayments = [...utils.formateRegistrationsToPayments(registrations), ...payments]
        //const sortedPayments = allPayments.sort((pay1, pay2) => pay2.createdAt - pay1.createdAt)


        registrationsGrowthStats
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        return response.status(200).json({
            attendancesStatsHour,
            registrationsGrowthStats,
            totalRegistrations,
            totalAttendances,
            totalMembers,
            totalEarnings,
            //totalDeductions,
            //netProfit,
            registrations,
            //payments: sortedPayments         
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

        const { lang } = request.query
        const { clubId } = request.params

        const dataValidation = clubValidation.updateClubData(request.body, lang)

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
                    message: translations[lang]['Phone is already registered'],
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
            message: translations[lang]['Club data updated successfully'],
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

const getAllClubData = async (request, response) => {

    try {

        const { clubId } = request.params

        const membersPromise = MemberModel.find({ clubId })
        const packagesPromise = PackageModel.find({ clubId })
        const registrationsPromise = RegistrationModel.find({ clubId })
        const attendancesPromise = AttendanceModel.find({ clubId })
        const freezedRegistrationsPromise = FreezedRegistrationModel.find({ clubId })

        const [members, packages, registrations, attendances, freezedRegistrations] = await Promise.all([
            membersPromise,
            packagesPromise,
            registrationsPromise,
            attendancesPromise,
            freezedRegistrationsPromise
        ])

        const notes = utils.extractMemberNotes(members)

        return response.status(200).json({
            accepted: true,
            members,
            notes,
            packages,
            registrations,
            attendances,
            freezedRegistrations
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

const updateClubWhatsappOffersLimit = async (request, response) => {

    try {

        const { clubId } = request.params
        const { limit } = request.body

        if(typeof limit != 'number' || limit > 100) {
            return response.status(400).json({
                accepted: false,
                message: 'Limit must be a number and lessthan or equal 100',
                field: 'limit'
            })
        }

        const updatedClub = await ClubModel
        .findByIdAndUpdate(clubId, { 'whatsapp.offersLimit': limit }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'updated new offers limit',
            club: updatedClub
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
    addClub, 
    getClubStatsByDate, 
    getClubs, 
    getClubsByOwner, 
    updateClub,
    updateClubStatus,
    deleteClub,
    deleteClubAndRelated,
    getClubMainStatsByDate,
    getAllClubData,
    updateClubImage,
    updateClubWhatsappOffersLimit
}