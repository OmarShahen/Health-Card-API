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

const getExpertReviewsStats = async (request, response) => {

    try {

        const { userId } = request.params

        const matchQuery = { expertId: mongoose.Types.ObjectId(userId) }

        const reviewsRatingList = await ReviewModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }
                }
            }
        ])

        const reviewsCommunicationList = await ReviewModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: null,
                    averageCommunication: { $avg: '$communication' }
                }
            }
        ])

        const reviewsUnderstandingList = await ReviewModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: null,
                    averageUnderstanding: { $avg: '$understanding' }
                }
            }
        ])

        const reviewsSolutionsList = await ReviewModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: null,
                    averageSolutions: { $avg: '$solutions' }
                }
            }
        ])

        const reviewsCommitmentList = await ReviewModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: null,
                    averageCommitment: { $avg: '$commitment' }
                }
            }
        ])

        let reviewsRating = 0
        let reviewsCommunication = 0
        let reviewsUnderstanding = 0
        let reviewsSolutions = 0
        let reviewsCommitment = 0

        if(reviewsRatingList.length != 0) {
            reviewsRating = reviewsRatingList[0].averageRating
        }

        if(reviewsCommunicationList.length != 0) {
            reviewsCommunication = reviewsCommunicationList[0].averageCommunication
        }

        if(reviewsUnderstandingList.length != 0) {
            reviewsUnderstanding = reviewsUnderstandingList[0].averageUnderstanding
        }

        if(reviewsSolutionsList.length != 0) {
            reviewsSolutions = reviewsSolutionsList[0].averageSolutions
        }

        if(reviewsCommitmentList.length != 0) {
            reviewsCommitment = reviewsCommitmentList[0].averageCommitment
        }


        return response.status(200).json({
            accepted: true,
            reviewsRating,
            reviewsCommunication,
            reviewsUnderstanding,
            reviewsSolutions,
            reviewsCommitment
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

const getExpertDetailedReviewsStats = async (request, response) => {

    try {

        const { userId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('expertId', userId, request.query)

        const totalReviews = await ReviewModel.countDocuments(searchQuery)

        const reviewsAverageRatingList = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: null,
                    average: { $avg: '$rating' }
                }
            }
        ])

        const reviewsRatings = await ReviewModel.aggregate([
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

        const reviewsCommunication = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$communication',
                    count: { $sum: 1 }
                }
            }
        ])

        const reviewsUnderstanding = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$understanding',
                    count: { $sum: 1 }
                }
            }
        ])

        const reviewsSolutions = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$solutions',
                    count: { $sum: 1 }
                }
            }
        ])

        const reviewsCommitment = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$commitment',
                    count: { $sum: 1 }
                }
            }
        ])

        const reviewsRecommendation = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$isRecommend',
                    count: { $sum: 1 }
                }
            }
        ])

        let reviewsAverageRating = 0

        if(reviewsAverageRatingList.length != 0) {
            reviewsAverageRating = reviewsAverageRatingList[0].average
        }

        return response.status(200).json({
            accepted: true,
            totalReviews,
            reviewsAverageRating,
            reviewsRatings,
            reviewsCommunication,
            reviewsUnderstanding,
            reviewsSolutions,
            reviewsCommitment,
            reviewsRecommendation
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
        let { limit, isHide } = request.query

        let { searchQuery } = utils.statsQueryGenerator('expertId', userId, request.query)

        if(isHide == 'TRUE') {
            searchQuery.isHide = true
        } else if(isHide == 'FALSE') {
            searchQuery.isHide = false
        }

        limit = limit ? Number.parseInt(limit) : 10

        const reviews = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: limit     
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

const searchReviewsByExpertIdAndSeekerName = async (request, response) => {

    try {

        const { userId } = request.params
        const { name } = request.query

        if(!name) {
            return response.status(400).json({
                accepted: false,
                message: 'No name to search for',
                field: 'name'
            })
        }

        const reviews = await ReviewModel.aggregate([
            {
                $match: { expertId: mongoose.Types.ObjectId(userId) }
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
                $match: {
                  $or: [
                    { 'seeker.firstName': { $regex: new RegExp(name, 'i') } },
                  ],
                }
            },
            {
                $limit: 25
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
                    'expert.password': 0,
                    'seeker.password': 0,
                }
            }
        ])

        reviews.forEach(review => {
            review.seeker = review.seeker[0]
            review.expert = review.expert[0]
        })

        return response.status(200).json({
            accepted: true,
            reviews,
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

        const newRating = 5
        if(averageRatingList.length != 0) {
            newRating = averageRatingList[0].total / 100
        }

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

const updateReviewVisibility = async (request, response) => {

    try {

        const dataValidation = reviewValidation.updateReviewVisibility(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { reviewId } = request.params
        const { isHide } = request.body

        const updatedReview = await ReviewModel
        .findByIdAndUpdate(reviewId, { isHide }, { new: true })
        
        return response.status(200).json({
            accepted: true,
            message: 'Updated review visibility successfully!',
            review: updatedReview
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
    searchReviewsByExpertIdAndSeekerName,
    getReviewsStats,
    getExpertReviewsStats,
    getExpertDetailedReviewsStats,
    updateReviewVisibility
}