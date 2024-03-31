const UserModel = require('../models/UserModel')
const AppointmentModel = require('../models/AppointmentModel')
const PaymentModel = require('../models/PaymentModel')
const ReviewModel = require('../models/ReviewModel')
const SpecialityModel = require('../models/SpecialityModel')
const expertValidation = require('../validations/experts')
const mongoose = require('mongoose')
const CounterModel = require('../models/CounterModel')
const bcrypt = require('bcrypt')
const config = require('../config/config')
const utils = require('../utils/utils')


const updateExpert = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = expertValidation.updateExpert(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { speciality, subSpeciality, meetingLink } = request.body

        if(speciality) {
            const specialitiesList = await SpecialityModel.find({ _id: { $in: speciality }, type: 'MAIN' })
            if(specialitiesList.length != speciality.length) {
                return response.status(400).json({
                    accepted: false,
                    message: 'invalid specialities Ids',
                    field: 'speciality'
                })
            }

            request.body.speciality = specialitiesList.map(special => special._id)
        }

        if(subSpeciality) {
            const specialitiesList = await SpecialityModel.find({ _id: { $in: subSpeciality }, type: 'SUB' })
            if(specialitiesList.length != subSpeciality.length) {
                return response.status(400).json({
                    accepted: false,
                    message: 'invalid subspecialities Ids',
                    field: 'subSpeciality'
                })
            }

            request.body.subSpeciality = specialitiesList.map(special => special._id)
        }

        if(meetingLink) {
            const totalExpertsMeetingsLinks = await UserModel.countDocuments({ meetingLink })
            if(totalExpertsMeetingsLinks != 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Meeting link is already registered',
                    field: 'meetingLink'
                })
            }
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, request.body, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Updated expert successfully!',
            user: updatedUser
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

const searchExperts = async (request, response) => {

    try {

        const { specialityId } = request.params
        let { gender, sortBy, subSpecialityId, page, limit, isAcceptPromoCodes, isOnline } = request.query

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

        if(isAcceptPromoCodes == 'TRUE') {
            matchQuery.isAcceptPromoCodes = true
        } else if(isAcceptPromoCodes == 'FALSE') {
            matchQuery.isAcceptPromoCodes = false
        }

        if(isOnline == 'TRUE') {
            matchQuery.isOnline = true
        } else if(isOnline == 'FALSE') {
            matchQuery.isOnline = false
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

        const { speciality } = request.query
        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const matchQuery = {
            ...searchQuery,
            type: 'EXPERT',
            isVerified: true
        }

        if(speciality) {
            matchQuery.speciality = { $in: [mongoose.Types.ObjectId(speciality)] }
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
                $lookup: {
                    from: 'specialities',
                    localField: 'speciality',
                    foreignField: '_id',
                    as: 'speciality'
                }
            },
            {
                $project: {
                    password: 0
                }
            }
        ])

        const totalExperts = await UserModel.countDocuments(matchQuery)

        experts.forEach(expert => {
            try {
                expert.profileCompletion = utils
                .calculateExpertProfileCompletePercentage(expert)
                .completionPercentage
            } catch(error) {
                error.message
            }
        })

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

        experts.forEach(expert => {
            try {
                expert.profileCompletion = utils
                .calculateExpertProfileCompletePercentage(expert)
                .completionPercentage
            } catch(error) {
                error.message
            }
        })

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

const addExpertMobileWalletInfo = async (request, response) => {

    try {

        const { userId } = request.params

        const dataValidation = expertValidation.addMobileWalletInfo(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { walletNumber } = request.body

        const updatedExpert = await UserModel
        .findByIdAndUpdate(userId, { 'paymentInfo.mobileWallet.walletNumber': walletNumber }, { new: true })

        updatedExpert.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Added expert mobile wallet information successfully!',
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

const updateExpertOnBoarding = async (request, response) => {

    try {

        const { userId } = request.params
        const { isOnBoarded } = request.body

        const dataValidation = expertValidation.updateExpertOnBoarding(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { isOnBoarded }, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Updated expert onboarding successfully!',
            user: updatedUser
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

const updateExpertPromoCodeAcceptance = async (request, response) => {

    try {

        const { userId } = request.params
        const { isAcceptPromoCodes } = request.body

        const dataValidation = expertValidation.updateExpertPromoCodesAcceptance(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { isAcceptPromoCodes }, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Updated expert promo code acceptance successfully!',
            user: updatedUser
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

const updateExpertOnlineStatus = async (request, response) => {

    try {

        const { userId } = request.params
        const { isOnline } = request.body

        const dataValidation = expertValidation.updateExpertOnline(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { isOnline }, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'Updated expert online status successfully!',
            user: updatedUser
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

const getExpertProfileCompletionPercentage = async (request, response) => {

    try {

        const { userId } = request.params

        const user = await UserModel.findById(userId)
        user.password = undefined

        const profileCompletionPercentage = utils.calculateExpertProfileCompletePercentage(user)

        return response.status(200).json({
            accepted: true,
            profileCompletionPercentage,
            user
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
    updateExpert,
    searchExperts, 
    searchExpertsByNameAndSpeciality, 
    searchExpertsByName,
    addExpert, 
    getExperts,
    deleteExpert,
    addExpertBankInfo,
    addExpertMobileWalletInfo,
    updateExpertOnBoarding,
    updateExpertOnlineStatus,
    getExpertProfileCompletionPercentage,
    updateExpertPromoCodeAcceptance
}