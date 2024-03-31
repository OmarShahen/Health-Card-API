const OpeningTimeModel = require('../models/OpeningTimeModel')
const openingTimeValidation = require('../validations/opening-times')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const utils = require('../utils/utils')
const mongoose = require('mongoose')


const getOpeningTimes = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)
        const limit = 10

        const openingTimes = await OpeningTimeModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'leads',
                    localField: 'leadId',
                    foreignField: '_id',
                    as: 'lead'
                }
            }
        ])

        const totalOpeningTimes = await OpeningTimeModel.countDocuments(searchQuery)

        openingTimes.forEach(openTime => openTime.lead = openTime.lead[0])

        return response.status(200).json({
            accepted: true,
            totalOpeningTimes,
            openingTimes
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


const getOpeningTimesByExpertId = async (request, response) => {

    try {

        const { userId } = request.params

        const openingTimes = await OpeningTimeModel.aggregate([
            {
                $match: { expertId: mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'expertId',
                    foreignField: '_id',
                    as: 'expert'
                }
            },
            {
                $sort: { 
                    createdAt: -1
                 }
            }
        ])

        openingTimes.forEach(openTime => openTime.expert = openTime.expert[0])

        return response.status(200).json({
            accepted: true,
            openingTimes
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

const getOpeningTimesByExpertIdAndDay = async (request, response) => {

    try {

        const { userId, weekday } = request.params

        const openingTime = await OpeningTimeModel.find({ expertId: userId, weekday, isActive:true })

        return response.status(200).json({
            accepted: true,
            openingTime
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

const searchOpeningTimes = async (request, response) => {

    try {

        const { county, weekday } = request.query

        const pipeLine = []

        if(weekday) {
            pipeLine.push({
                $match: { weekday }
            })
        }

        pipeLine.push({
            $lookup: {
                from: 'leads',
                localField: 'leadId',
                foreignField: '_id',
                as: 'lead'
            }
        })

        if(county) {
            pipeLine.push({
                $match: {
                    'lead.county': county
                }
            })
        }

        pipeLine.push({
            $sort: {
                'openingTime.hour': 1
            }
        })

        const openingTimes = await OpeningTimeModel.aggregate(pipeLine)

        const totalOpeningTimes = openingTimes.length

        openingTimes.forEach(openTime => openTime.lead = openTime.lead[0])

        return response.status(200).json({
            accepted: true,
            totalOpeningTimes,
            openingTimes
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

const addOpeningTime = async (request, response) => {

    try {

        const dataValidation = openingTimeValidation.addOpeningTime(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { expertId, weekday, openingTime, closingTime } = request.body
        
        if(expertId) {
            const expert = await UserModel.findById(expertId)
            if(!expert) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Expert ID is not registered',
                    field: 'expertId'
                })
            }
        }
        
        const searchQuery = { expertId, weekday, isActive: true }

        const openingTimeList = await OpeningTimeModel.find(searchQuery)
        if(openingTimeList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Opening time is already registered',
                field: 'weekday'
            })
        }

        const openingSplitted = openingTime.split(':')
        const openingHour = Number.parseInt(openingSplitted[0])
        const openingMinute = Number.parseInt(openingSplitted[1])

        const closingSplitted = closingTime.split(':')
        const closingHour = Number.parseInt(closingSplitted[0])
        const closingMinute = Number.parseInt(closingSplitted[1])

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'OpeningTime' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const openingTimeData = {
            expertId,
            openingTimeId: counter.value,
            weekday,
            openingTime: {
                hour: openingHour,
                minute: openingMinute
            },
            closingTime: {
                hour: closingHour,
                minute: closingMinute
            }

        }
        const openingTimeObj = new OpeningTimeModel(openingTimeData)
        const newOpeningTime = await openingTimeObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added opening time successfully!',
            openingTime: newOpeningTime
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

const updateOpeningTime = async (request, response) => {

    try {

        const dataValidation = openingTimeValidation.updateOpeningTime(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { openingTimeId } = request.params
        const { weekday, openingTime, closingTime } = request.body

        const openingTimeObj = await OpeningTimeModel.findById(openingTimeId)

        if(openingTimeObj.weekday != weekday) {

            const searchQuery = { expertId: openingTimeObj.expertId, weekday }
            
            const openingTimeList = await OpeningTimeModel.find(searchQuery)
            if(openingTimeList.length != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Opening time is already registered',
                    field: 'weekday'
                })
            }
        }

        const openingSplitted = openingTime.split(':')
        const openingHour = Number.parseInt(openingSplitted[0])
        const openingMinute = Number.parseInt(openingSplitted[1])

        const closingSplitted = closingTime.split(':')
        const closingHour = Number.parseInt(closingSplitted[0])
        const closingMinute = Number.parseInt(closingSplitted[1])

        const openingTimeData = {
            weekday,
            openingTime: {
                hour: openingHour,
                minute: openingMinute
            },
            closingTime: {
                hour: closingHour,
                minute: closingMinute
            }

        }
        
        const updatedOpeningTime = await OpeningTimeModel
        .findByIdAndUpdate(openingTimeId, openingTimeData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated opening time successfully!',
            openingTime: updatedOpeningTime
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

const updateOpeningTimeActivityStatus = async (request, response) => {

    try {

        const dataValidation = openingTimeValidation.updateOpeningTimeActivityStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { openingTimeId } = request.params
        const { isActive } = request.body
        
        const updatedOpeningTime = await OpeningTimeModel
        .findByIdAndUpdate(openingTimeId, { isActive }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated opening time successfully!',
            openingTime: updatedOpeningTime
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

const deleteOpeningTime = async (request, response) => {

    try {

        const { openingTimeId } = request.params

        const deletedOpeningTime = await OpeningTimeModel.findByIdAndDelete(openingTimeId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted opening time successfully!',
            openingTime: deletedOpeningTime
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
    getOpeningTimes,
    getOpeningTimesByExpertId,
    getOpeningTimesByExpertIdAndDay,
    addOpeningTime, 
    updateOpeningTime,
    updateOpeningTimeActivityStatus, 
    deleteOpeningTime,
    searchOpeningTimes
}