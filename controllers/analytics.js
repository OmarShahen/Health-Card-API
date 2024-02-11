const UserModel = require('../models/UserModel')
const AppointmentModel = require('../models/AppointmentModel')
const ExpertVerificationModel = require('../models/ExpertVerificationModel')
const ReviewModel = require('../models/ReviewModel')
const utils = require('../utils/utils')


const getOverviewAnalytics = async (request, response) => {

    try {


        /*const clinicPatientsGrowth = await ClinicPatientModel.aggregate([
            {
                $match: {
                    clinicId: { $in: uniqueOwnedIdsList }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ])

        const patientsSurveysOverallExperienceScores = await PatientSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$overallExperience',
                    count: { $sum: 1 }
                }
            }
        ])

        const treatmentsSurveysImprovementScores = await TreatmentSurveyModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: '$improvement',
                    count: { $sum: 1 }
                }
            }
        ])*/

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const totalSeekers = await UserModel
        .countDocuments({ ...searchQuery, isVerified: true, type: 'SEEKER' })

        const totalExperts = await UserModel
        .countDocuments({ ...searchQuery, isVerified: true, type: 'EXPERT' })

        const totalAppointments = await AppointmentModel
        .countDocuments({ ...searchQuery, isPaid: true })

        const totalExpertVerifications = await ExpertVerificationModel
        .countDocuments({ ...searchQuery })

        const totalReviews = await ReviewModel
        .countDocuments({ ...searchQuery })

        const reviewsRatingList = await ReviewModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }
                }
            }
        ])

        let reviewsRating = 0

        if(reviewsRatingList.length != 0) {
            reviewsRating = reviewsRatingList[0].averageRating
            reviewsRating = Number.parseFloat(reviewsRating.toFixed(2))
        }

        return response.status(200).json({
            accepted: true,
            totalSeekers,
            totalExperts,
            totalAppointments,
            totalExpertVerifications,
            totalReviews,
            reviewsRating
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

const getUsersGrowthStats = async (request, response) => {

    try {

        const { groupBy, type } = request.query

        let format = '%Y-%m-%d'

        if(groupBy == 'MONTH') {
            format = '%Y-%m'
        } else if(groupBy == 'YEAR') {
            format = '%Y'
        }

        let matchQuery = { isVerified: true }

        if(type == 'SEEKER') {
            matchQuery.type = 'SEEKER'
        } else if(type == 'EXPERT') {
            matchQuery.type = 'EXPERT'
        }

        const usersGrowth = await UserModel.aggregate([
            {
                $match: matchQuery
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
            usersGrowth
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
    getOverviewAnalytics, 
    getUsersGrowthStats
}