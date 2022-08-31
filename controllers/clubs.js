const config = require('../config/config')
const utils = require('../utils/utils')
const dateFNS = require('date-fns')
const mongoose = require('mongoose')
const ClubModel = require('../models/ClubModel')
const CountryModel = require('../models/countryModel')
const RegistrationModel = require('../models/RegistrationModel')
const clubValidation = require('../validations/clubs')

const addClub = async (request, response) => {

    try {

        const dataValidation = clubValidation.clubData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field:  dataValidation.field
            })
        }

        const { phone, countryCode } = request.body

        const phoneList = await ClubModel.find({ phone, countryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already registered',
                field: 'phone'
            })
        }

        let { country, city } = request.body.location

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

        const club = request.body

        const clubObj = new ClubModel(club)
        const newClub = await clubObj.save()


        return response.status(200).json({
            message: `${club.name} is added to our gyms network successfully`,
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

        const { clubId, statsDate } = request.params

        if(!utils.isDateValid(statsDate)) {
            return response.status(400).json({
                message: 'invalid date formate',
                field: 'statsDate'
            })
        }

        let fromDateTemp = new Date(statsDate)
        let toDate = new Date(fromDateTemp.setDate(fromDateTemp.getDate() + 1))
        let fromDate = new Date(statsDate)

        const registrationsPromise = RegistrationModel
        .find({ clubId, createdAt: {
            $gte: fromDate,
            $lte: toDate
        }})
        .select({ attendances: 0 })


        const attendancesListPromise = RegistrationModel.aggregate([
            {
                $match: {
                    clubId: mongoose.Types.ObjectId(clubId),
                    'attendances.attendanceDate': {
                        $gte: fromDate,
                        $lte: toDate
                }
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

        const [registrations, attendancesList] = await Promise.all([
            registrationsPromise,
            attendancesListPromise
        ])

        const totalRegistrations = registrations.length
        const totalEarnings = utils.calculateRegistrationsTotalEarnings(registrations)
        const attendances = utils.calculateTotalAttendanceByDate(attendancesList, fromDate, toDate)
        const totalAttendances = attendances.length

        return response.status(200).json({
            registrations,
            totalRegistrations,
            totalEarnings,
            attendances,
            totalAttendances,
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

        const clubs = await ClubModel.find()

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