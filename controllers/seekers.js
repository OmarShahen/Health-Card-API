const UserModel = require('../models/UserModel')
const AppointmentModel = require('../models/AppointmentModel')
const PaymentModel = require('../models/PaymentModel')
const ReviewModel = require('../models/ReviewModel')
const utils = require('../utils/utils')

const getSeekers = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const matchQuery = {
            ...searchQuery,
            type: 'SEEKER',
            isVerified: true
        }

        const seekers = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 25
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        const totalSeekers = await UserModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalSeekers,
            seekers
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

const searchSeekersByName = async (request, response) => {

    try {

        let { name } = request.query

        name = name ? name : ''

        const matchQuery = {
            isVerified: true,
            type: 'SEEKER',
            firstName: { $regex: name, $options: 'i' }
        }

        const seekers = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 25
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        return response.status(200).json({
            accepted: true,
            seekers
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

const deleteSeeker = async (request, response) => {

    try {

        const { userId } = request.params

        const appointmentsPromise = AppointmentModel.find({ seekerId: userId })
        const paymentsPromise = PaymentModel.find({ seekerId: userId })
        const reviewsPromise = ReviewModel.find({ seekerId: userId })

        const [appointments, payments, reviews] = await Promise.all([appointmentsPromise, paymentsPromise, reviewsPromise])

        if(appointments.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Seeker is registered with appointments',
                field: 'appointments'
            })
        }

        if(payments.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Seeker is registered with payments',
                field: 'payments'
            })
        }

        if(reviews.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Seeker is registered with reviews',
                field: 'reviews'
            })
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted seeker successfully!',
            user: deletedUser
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
    searchSeekersByName,
    getSeekers,
    deleteSeeker
}