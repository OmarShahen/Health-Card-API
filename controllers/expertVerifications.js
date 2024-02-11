const ExpertVerificationModel = require('../models/ExpertVerificationModel')
const SpecialityModel = require('../models/SpecialityModel')
const CounterModel = require('../models/CounterModel')
const expertVerificationValidation = require('../validations/expertVerifications')
const utils = require('../utils/utils')
const email = require('../mails/send-email')
const config = require('../config/config')
const emailTemplates = require('../mails/templates/messages')

const getExpertVerifications = async (request, response) => {

    try {

        const { status } = request.query
        let { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        if(status) {
            searchQuery = { ...searchQuery, status }
        }

        const expertsVerifications = await ExpertVerificationModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 25
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'specialityId',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
        ])

        expertsVerifications.forEach(expertVerification => expertVerification.speciality = expertVerification.speciality[0])

        const matchQuery = utils.statsQueryGenerator('none', 0, request.query)

        const totalExpertsVerifications = await ExpertVerificationModel.countDocuments(matchQuery.searchQuery)
        const totalAcceptedExpertsVerifications = await ExpertVerificationModel.countDocuments({ ...matchQuery.searchQuery, status: 'ACCEPTED' })
        const totalPendingExpertsVerifications = await ExpertVerificationModel.countDocuments({ ...matchQuery.searchQuery, status: 'PENDING' })
        const totalRejectedExpertsVerifications = await ExpertVerificationModel.countDocuments({ ...matchQuery.searchQuery, status: 'REJECTED' })

        return response.status(200).json({
            accepted: true,
            totalExpertsVerifications,
            totalAcceptedExpertsVerifications,
            totalPendingExpertsVerifications,
            totalRejectedExpertsVerifications,
            expertsVerifications
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

const searchExpertsVerificationsByName = async (request, response) => {

    try {

        let { name } = request.query

        name = name ? name : ''

        const matchQuery = {
            name: { $regex: name, $options: 'i' }
        }

        const expertsVerifications = await ExpertVerificationModel.aggregate([
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
                $lookup: {
                    from: 'specialities',
                    localField: 'specialityId',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
        ])

        expertsVerifications.forEach(expertVerification => expertVerification.speciality = expertVerification.speciality[0])

        return response.status(200).json({
            accepted: true,
            expertsVerifications
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

const addExpertVerification = async (request, response) => {

    try {

        const dataValidation = expertVerificationValidation.addExpertVerification(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { specialityId } = request.body

        const speciality = await SpecialityModel.findById(specialityId)
        if(!speciality) {
            return response.status(400).json({
                accepted: false,
                message: 'Speciality ID is not registered',
                field: 'specialityId'
            })
        }   

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'ExpertVerification' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const expertVerificationData = { expertVerificationId: counter.value, ...request.body }
        const expertVerificationObj = new ExpertVerificationModel(expertVerificationData)
        const newExpertVerification = await expertVerificationObj.save()

        const mailData = {
            receiverEmail: config.NOTIFICATION_EMAIL,
            subject: 'New Expert Verification Request',
            mailBodyText: `You got new expert verification request #${newExpertVerification.expertVerificationId}`,
            mailBodyHTML: `
            <strong>ID: </strong><span>#${newExpertVerification.expertVerificationId}</span><br />
            <strong>Name: </strong><span>${newExpertVerification.name}</span><br />
            <strong>Email: </strong><span>${newExpertVerification.email}</span><br />
            <strong>Phone: </strong><span>+${newExpertVerification.countryCode}${newExpertVerification.phone}</span><br />
            <strong>Speciality: </strong><span>${speciality.name}</span><br />
            <strong>Description: </strong><span>${newExpertVerification.description}</span><br />
            `
        }
        const sentEmail = await email.sendEmail(mailData)

        return response.status(200).json({
            accepted: true,
            message: 'Added expert verification successfully!',
            sentEmail,
            expertVerification: newExpertVerification
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

const updateExpertVerificationStatus = async (request, response) => {

    try {

        const { expertVerificationId } = request.params
        const { status } = request.body

        const dataValidation = expertVerificationValidation.updateExpertVerificationStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        } 

        const updatedExpertVerification = await ExpertVerificationModel
        .findByIdAndUpdate(expertVerificationId, { status }, { new: true })

        let emailSent

        if(status == 'REJECTED') {
            const mailData = {
                receiverEmail: updatedExpertVerification.email,
                subject: 'Expert Verification Request - Rejection',
                mailBodyHTML: emailTemplates.getExpertVerificationRejectionMessage({ expertName: updatedExpertVerification.name }) 
            }
            
            emailSent = await email.sendEmail(mailData)   
        }

        if(status == 'ACCEPTED') {

            const mailtemplateData = {
                expertName: updatedExpertVerification.name,
                signupLink: `${config.EXPERT_SIGNUP_LINK}?type=EXPERT&expertVerification=${updatedExpertVerification._id}`
            }
            
            const mailData = {
                receiverEmail: updatedExpertVerification.email,
                subject: 'Congratulations! Your Expert Verification Request has been Accepted',
                mailBodyHTML: emailTemplates.getExpertVerificationAcceptanceMessage(mailtemplateData) 
            }
            
            emailSent = await email.sendEmail(mailData)   
        }

        return response.status(200).json({
            accepted: true,
            message: 'Updated expert verification status successfully!',
            emailSent,
            expertVerification: updatedExpertVerification
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

const deleteExpertVerification = async (request, response) => {

    try {

        const { expertVerificationId } = request.params

        const deletedExpertVerification = await ExpertVerificationModel.findByIdAndDelete(expertVerificationId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted expert verification successfully!',
            expertVerification: deletedExpertVerification
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

const getExpertVerificationsGrowthStats = async (request, response) => {

    try {

        const { groupBy } = request.query

        let format = '%Y-%m-%d'
        let countMethod = { $sum: 1 }

        if(groupBy == 'MONTH') {
            format = '%Y-%m'
        } else if(groupBy == 'YEAR') {
            format = '%Y'
        }

        const expertsVerificationsGrowth = await ExpertVerificationModel.aggregate([
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: format,
                    date: '$createdAt',
                  },
                },
                count: countMethod,
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
            expertsVerificationsGrowth
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
    getExpertVerifications, 
    addExpertVerification, 
    searchExpertsVerificationsByName,
    deleteExpertVerification,
    updateExpertVerificationStatus,
    getExpertVerificationsGrowthStats
}