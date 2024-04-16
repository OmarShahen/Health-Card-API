const ViewModel = require('../models/ViewModel')
const UserModel = require('../models/UserModel')
const viewValidation = require('../validations/views')
const mongoose = require('mongoose')
const utils = require('../utils/utils')


const getViews = async (request, response) => {

    try {

        const views = await ViewModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            views
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

const addView = async (request, response) => {

    try {

        const dataValidation = viewValidation.addView(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { seekerId, expertId } = request.body

        const seekerPromise = UserModel.findById(seekerId)
        const expertPromise = UserModel.findById(expertId)

        const [seeker, expert] = await Promise.all([seekerPromise, expertPromise])

        if(!seeker) {
            return response.status(400).json({
                accepted: false,
                message: 'Seeker ID does not exists',
                field: 'seekerId'
            })
        }

        if(!expert) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert ID does not exists',
                field: 'expertId'
            })
        }

        const viewData = { ...request.body }
        const viewObj = new ViewModel(viewData)
        const newView = await viewObj.save()

        const updatedExpert = await UserModel
        .findByIdAndUpdate(expertId, { $inc: { views: 1 } }, { new: true })

        updatedExpert.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Added view successfully!',
            view: newView,
            expert: updatedExpert
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

const getExpertViewsGrowthStats = async (request, response) => {

    try {

        const { userId } = request.params
        const { groupBy } = request.query

        let format = '%Y-%m-%d'

        if(groupBy == 'MONTH') {
            format = '%Y-%m'
        } else if(groupBy == 'YEAR') {
            format = '%Y'
        }

        const { searchQuery } = utils.statsQueryGenerator('expertId', userId, request.query)

        const viewsGrowth = await ViewModel.aggregate([
            {
                $match: searchQuery
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: format,
                    date: '$createdAt',
                  },
                },
                count: { $sum: 1 },
              },
            },
            {
              $sort: {
                '_id': 1,
              },
            },
        ])

        return response.status(200).json({
            accepted: true,
            viewsGrowth
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

const getExpertPagesStats = async (request, response) => {

    try {

        const { userId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('expertId', userId, request.query)

        const viewsStats = await ViewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$page',
                    count: { $sum: 1 }
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            viewsStats
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

const getExpertViewsTotal = async (request, response) => {

    try {

        const { userId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('expertId', userId, request.query)

        const totalViews = await ViewModel.countDocuments(searchQuery)

        return response.status(200).json({
            accepted: true,
            totalViews
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
    getViews, 
    addView, 
    getExpertViewsGrowthStats, 
    getExpertPagesStats,
    getExpertViewsTotal
}