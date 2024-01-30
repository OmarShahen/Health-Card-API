const utils = require('../utils/utils')
const UserModel = require('../models/UserModel')
const AppointmentModel = require('../models/AppointmentModel')
const SpecialityModel = require('../models/SpecialityModel')
const OpeningTimeModel = require('../models/OpeningTimeModel')
const ReviewModel = require('../models/ReviewModel')
const ExpertVerificationModel = require('../models/ExpertVerificationModel')


const verifyUserId = async (request, response, next) => {

    try {

        const { userId } = request.params

        if(!utils.isObjectId(userId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid user Id formate',
                field: 'userId'
            })
        }

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(404).json({
                accepted: false,
                message: 'user Id does not exist',
                field: 'userId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyAppointmentId = async (request, response, next) => {

    try {

        const { appointmentId } = request.params

        if(!utils.isObjectId(appointmentId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid appointment Id formate',
                field: 'appointmentId'
            })
        }

        const appointment = await AppointmentModel.findById(appointmentId)
        if(!appointment) {
            return response.status(404).json({
                accepted: false,
                message: 'appointment Id does not exist',
                field: 'appointmentId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifySpecialityId = async (request, response, next) => {

    try {

        const { specialityId } = request.params

        if(!utils.isObjectId(specialityId)) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid speciality Id formate',
                field: 'specialityId'
            })
        }

        const speciality = await SpecialityModel.findById(specialityId)
        if(!speciality) {
            return response.status(404).json({
                accepted: false,
                message: 'speciality Id does not exist',
                field: 'specialityId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


const verifyOpeningTimeId = async (request, response, next) => {

    try {

        const { openingTimeId } = request.params

        if(!utils.isObjectId(openingTimeId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid opening ID format',
                field: 'openingTimeId'
            })
        }

        const openingTime = await OpeningTimeModel.findById(openingTimeId)
        if(!openingTime) {
            return response.status(404).json({
                accepted: false,
                message: 'Opening ID does not exist',
                field: 'openingTimeId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyReviewId = async (request, response, next) => {

    try {

        const { reviewId } = request.params

        if(!utils.isObjectId(reviewId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid review ID format',
                field: 'reviewId'
            })
        }

        const review = await ReviewModel.findById(reviewId)
        if(!review) {
            return response.status(404).json({
                accepted: false,
                message: 'Review ID does not exist',
                field: 'reviewId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyExpertVerificationId = async (request, response, next) => {

    try {

        const { expertVerificationId } = request.params

        if(!utils.isObjectId(expertVerificationId)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid expert verification ID format',
                field: 'expertVerificationId'
            })
        }

        const expertVerification = await ExpertVerificationModel.findById(expertVerificationId)
        if(!expertVerification) {
            return response.status(404).json({
                accepted: false,
                message: 'Expert verification ID does not exist',
                field: 'expertVerificationId'
            })
        }

        return next()

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
    verifyUserId,
    verifyAppointmentId,
    verifySpecialityId,
    verifyOpeningTimeId,
    verifyReviewId,
    verifyExpertVerificationId
}