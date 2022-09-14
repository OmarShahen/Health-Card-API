const config = require('../config/config')
const utils = require('../utils/utils')
const dateFNS = require('date-fns')
const mongoose = require('mongoose')
const ClubModel = require('../models/ClubModel')
const CountryModel = require('../models/countryModel')
const RegistrationModel = require('../models/RegistrationModel')
const AttendanceModel = require('../models/AttendanceModel')
const ChainOwnerModel = require('../models/ChainOwnerModel')
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


        return response.status(200).json({
            message: `${club.name} is added to our clubs network successfully!`,
            club: newClub
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
        const { searchQuery } = utils.statsQueryGenerator('clubId', clubId, request.query)


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


        const attendancesPromise = AttendanceModel.aggregate([
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
            $lookup: {
                from: 'clubs',
                localField: 'clubId',
                foreignField: '_id',
                as: 'club'
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

        const attendancesStatsByHoursPromise = AttendanceModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%dT%H', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const attendancesStatsByMonthsPromise = AttendanceModel.aggregate([
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

        const [registrations, attendances, attendancesStatsByHours, attendancesStatsByMonths] = await Promise.all([
            registrationsPromise,
            attendancesPromise,
            attendancesStatsByHoursPromise,
            attendancesStatsByMonthsPromise
        ])

        const totalRegistrations = registrations.length
        const totalEarnings = utils.calculateRegistrationsTotalEarnings(registrations)
        const totalAttendances = attendances.length

        attendancesStatsByHours.forEach(hour => hour._id = hour._id.split('T')[1] + ':00')
        attendancesStatsByHours
        .sort((hour1, hour2) => Number.parseInt(hour1._id) - Number.parseInt(hour2._id))

        attendancesStatsByMonths
        .sort((month1, month2) => new Date(month1._id) - new Date(month2._id))

        return response.status(200).json({
            attendancesStatsByHours,
            attendancesStatsByMonths,
            totalRegistrations,
            totalAttendances,
            totalEarnings,
            registrations,
            attendances,
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

        const clubs = await ClubModel
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


module.exports = { addClub, getClubStatsByDate, getClubs }