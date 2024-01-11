const ReviewModel = require('../models/ReviewModel')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const reviewValidation = require('../validations/reviews')
const mongoose = require('mongoose')
const utils = require('../utils/utils')


const getReviews = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const reviews = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $limit: 25
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
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
                $project: {
                    'seeker.password': 0,
                    'expert.password': 0
                }
            }
        ])

        const totalReviews = await ReviewModel.countDocuments(searchQuery)

        reviews.forEach(review => {
            review.seeker = review.seeker[0]
            review.expert = review.expert[0]
        })

        return response.status(200).json({
            accepted: true,
            totalReviews,
            reviews
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

const getReviewsStats = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const reviewsStats = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            }
        ])


        return response.status(200).json({
            accepted: true,
            reviewsStats,
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

const getReviewsByExpertId = async (request, response) => {

    try {

        const { userId } = request.params

        const reviews = await ReviewModel.aggregate([
            {
                $match: { expertId: mongoose.Types.ObjectId(userId) }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 10      
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
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
                $project: {
                    'seeker.password': 0,
                    'expert.password': 0
                }
            }
        ])

        reviews.map(review => {
            review.seeker = review.seeker[0]
            review.expert = review.expert[0]
        }) 

        return response.status(200).json({
            accepted: true,
            reviews
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

const addReview = async (request, response) => {

    try {

        const dataValidation = reviewValidation.addReview(request.body)
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
                message: 'Seeker ID is not registered',
                field: 'seekerId'
            })
        }

        if(!expert) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert ID is not registered',
                field: 'expertId'
            })
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'review' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const reviewData = { reviewId: counter.value, ...request.body }
        const reviewObj = new ReviewModel(reviewData)
        const newReview = await reviewObj.save()

        const averageRatingList = await ReviewModel.aggregate([
            {
                $match: { expertId: expert._id }
            },
            {
                $group: {
                  _id: '$expertId',
                  averageRating: { $avg: '$rating' }
                }
            }
        ])

        const newRating = averageRatingList[0].averageRating

        const updatedUser = await UserModel
        .findByIdAndUpdate(expert._id, { totalReviews: expert.totalReviews + 1, rating: newRating }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Review is added successfully!',
            review: newReview,
            expert: updatedUser
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

const deleteReview = async (request, response) => {

    try {

        const { reviewId } = request.params

        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId)

        const expert = await UserModel.findById(deletedReview.expertId)

        const averageRatingList = await ReviewModel.aggregate([
            {
                $match: { expertId: expert._id }
            },
            {
                $group: {
                  _id: '$expertId',
                  averageRating: { $avg: '$rating' }
                }
            }
        ])

        const newRating = averageRatingList[0].averageRating

        const updatedUser = await UserModel
        .findByIdAndUpdate(expert._id, { totalReviews: expert.totalReviews - 1, rating: newRating }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Deleted review successfully!',
            review: deletedReview,
            expert: updatedUser
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
    getReviews, 
    addReview, 
    deleteReview, 
    getReviewsByExpertId, 
    getReviewsStats 
}