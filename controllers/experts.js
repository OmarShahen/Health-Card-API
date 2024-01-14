const UserModel = require('../models/UserModel')
const AppointmentModel = require('../models/AppointmentModel')
const PaymentModel = require('../models/PaymentModel')
const ReviewModel = require('../models/ReviewModel')
const expertValidation = require('../validations/experts')
const mongoose = require('mongoose')
const CounterModel = require('../models/CounterModel')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const utils = require('../utils/utils')

const searchExperts = async (request, response) => {

    try {

        const { specialityId } = request.params
        let { gender, sortBy, subSpecialityId, page, limit } = request.query

        page = page ? page : 1
        limit = limit ? limit : 10

        const skip = (page - 1) * limit

        const matchQuery = {
            speciality: { $in: [mongoose.Types.ObjectId(specialityId)] },
            isVerified: true,
            isShow: true,
            isDeactivated: false,
            isBlocked: false,
            type: 'EXPERT'
        }

        let sortQuery = { createdAt: -1 }

        if(gender) {
            matchQuery.gender = gender
        }

        if(subSpecialityId) {
            matchQuery.subSpeciality = { $in: [mongoose.Types.ObjectId(subSpecialityId)] }
        }

        if(sortBy == 'HIGH-RATING') {
            sortQuery.rating = -1
        } else if(sortBy == 'HIGH-PRICE') {
            sortQuery['pricing.price'] = -1
        } else if(sortBy == 'LOW-PRICE') {
            sortQuery['pricing.price'] = 1
        }


        const experts = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { rating: -1, createdAt: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: Number.parseInt(limit)
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'subSpeciality',
                    foreignField: '_id',
                    as: 'subSpeciality'
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        let totalExperts = await UserModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalExperts,
            experts
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

const searchExpertsByNameAndSpeciality = async (request, response) => {

    try {

        const { specialityId, name } = request.params

        const matchQuery = {
            speciality: { $in: [mongoose.Types.ObjectId(specialityId)] },
            isVerified: true,
            isShow: true,
            isDeactivated: false,
            isBlocked: false,
            type: 'EXPERT',
            firstName: { $regex: name, $options: 'i' }
        }

        const experts = await UserModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
            {
                $lookup: {
                    from: 'specialities',
                    localField: 'subSpeciality',
                    foreignField: '_id',
                    as: 'subSpeciality'
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        const totalExperts = await UserModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalExperts,
            experts
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

const addExpert = async (request, response) => {

    try {

        const dataValidation = expertValidation.addExpert(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Email is already registered',
                field: 'email'
            })
        }

        const expertData = {
            ...request.body,
            type: 'EXPERT',
            isVerified: true,
        }

        const hashedPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)

        expertData.password = hashedPassword   

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'user' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        expertData.userId = counter.value

        const userObj = new UserModel(expertData)
        const newUser = await userObj.save()

        newUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Added expert successfully!',
            user: newUser
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

const getExperts = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const matchQuery = {
            ...searchQuery,
            type: 'EXPERT',
            isVerified: true
        }

        const experts = await UserModel.aggregate([
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

        const totalExperts = await UserModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalExperts,
            experts
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

const searchExpertsByName = async (request, response) => {

    try {

        let { name } = request.query

        name = name ? name : ''

        const matchQuery = {
            isVerified: true,
            type: 'EXPERT',
            firstName: { $regex: name, $options: 'i' }
        }

        const experts = await UserModel.aggregate([
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
            experts
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

const deleteExpert = async (request, response) => {

    try {

        const { userId } = request.params

        const appointmentsPromise = AppointmentModel.find({ expertId: userId })
        const paymentsPromise = PaymentModel.find({ expertId: userId })
        const reviewsPromise = ReviewModel.find({ expertId: userId })

        const [appointments, payments, reviews] = await Promise.all([appointmentsPromise, paymentsPromise, reviewsPromise])

        if(appointments.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert is registered with appointments',
                field: 'appointments'
            })
        }

        if(payments.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert is registered with payments',
                field: 'payments'
            })
        }

        if(reviews.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert is registered with reviews',
                field: 'reviews'
            })
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId)

        return response.status(200).json({
            accepted: true,
            message: 'Deleted expert successfully!',
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

const addExpertBankInfo = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = expertValidation.addBankInfo(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { accountNumber, accountHolderName, bankName } = request.body

        const bankInfoData = { accountNumber, accountHolderName, bankName }

        const updatedExpert = await UserModel
        .findByIdAndUpdate(userId, { 'paymentInfo.bankAccount': bankInfoData }, { new: true })

        updatedExpert.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Added expert bank information successfully!',
            user: updatedExpert
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
    searchExperts, 
    searchExpertsByNameAndSpeciality, 
    searchExpertsByName,
    addExpert, 
    getExperts,
    deleteExpert,
    addExpertBankInfo
}