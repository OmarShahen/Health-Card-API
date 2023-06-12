const config = require('../config/config')
const authValidation = require('../validations/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/UserModel')
const CounterModel = require('../models/CounterModel')
const SpecialityModel = require('../models/SpecialityModel')
const EmailVerificationModel = require('../models/EmailVerificationModel')
const { generateVerificationCode } = require('../utils/random-number')
const utils = require('../utils/utils')
const nodemailer = require('nodemailer')
const { sendVerificationCode } = require('../mails/verification-code')

const userSignup = async (request, response) => {

    try {

        const dataValidation = authValidation.doctorSignup(request.body)
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

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'user' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const userPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)
        const userData = { ...request.body, userId: counter.value, password: userPassword }

        const userObj = new UserModel(userData)
        const newUser = await userObj.save()

        const verificationCode = generateVerificationCode()
        const mailData = await sendVerificationCode({ receiverEmail: email, verificationCode })

        const emailVerificationData = { userId: newUser._id, code: verificationCode }
        const emailVerificationObj = new EmailVerificationModel(emailVerificationData)
        const newEmailVerification = await emailVerificationObj.save()

        newUser.password = undefined
        const token = jwt.sign({ user: newUser }, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            accepted: true,
            message: 'Account created successfully!',
            mailSuccess: mailData.isSent,
            message: mailData.isSent ? 'email is sent successfully!' : 'there was a problem sending your email',
            user: newUser,
            emailVerification: newEmailVerification,
            accessToken: token
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

const userLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.doctorLogin(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const userList = await UserModel.find({ email, isverified: true })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Email is not registered',
                field: 'email'
            })
        }

        const user = userList[0]

        if(!bcrypt.compareSync(password, user.password)) {
            return response.status(400).json({
                accepted: false,
                message: 'Incorrect password',
                field: 'password'
            })
        }

        user.password = undefined

        const token = jwt.sign(user._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            accepted: true,
            token: token,
            user,
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

const verifyEmailVerificationCode = async (request, response) => {

    try {

        const { userId, verificationCode } = request.params

        const emailVerificationList = await EmailVerificationModel.find({ userId, code: verificationCode })
        if(emailVerificationList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'there is no verification code registered',
                field: 'code'
            })
        }

        const updatedUserPromise = UserModel
        .findByIdAndUpdate(userId, { isVerified: true },{ new: true })

        const deleteCodesPromise = EmailVerificationModel.deleteMany({ userId })

        const [updatedUser, deleteCodes] = await Promise.all([updatedUserPromise, deleteCodesPromise])

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'account has been verified successfully!',
            user: updatedUser,
            deletedCodes: deleteCodes.deletedCount
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
const verifyPersonalInfo = async (request, response) => {

    try {

        const dataValidation = authValidation.verifyPersonalInfo(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        return response.status(200).json({
            accepted: true,
            data: request.body
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
const verifySpecialityInfo = async (request, response) => {

    try {

        const dataValidation = authValidation.verifySpecialityInfo(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { speciality } = request.body

        const specialitiesList = await SpecialityModel.find({ _id: { $in: speciality } })
        if(specialitiesList.length != speciality.length) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid specialities Ids',
                field: 'speciality'
            })
        }

        return response.status(200).json({
            accepted: true,
            data: request.body
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

const verifyEmail = async (request, response) => {

    try {

        const { email } = request.params

        if(!utils.isEmailValid(email)) {
            return response.status(400).json({
                accepted: false,
                message: 'email format is invalid',
                field: 'email'
            })
        }

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'email is already registered',
                field: 'email'
            })
        }

        return response.status(200).json({
            accepted: true,
            email
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

const setUserVerified = async (request, response) => {

    try {

        const { userId } = request.params

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, { isVerified: true }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'account verified successfully!',
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

const addUserEmailVerificationCode = async (request, response) => {

    try {

        const { userId } = request.params

        if(!utils.isObjectId(userId)) {
            return response.status(400).json({
                accepted: false,
                message: 'user Id format is invalid',
                field: 'userId'
            })
        }

        const user = await UserModel.findById(userId)
        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'user Id does not exist',
                field: 'userId'
            })
        }

        if(user.isVerified) {
            return response.status(400).json({
                accepted: false,
                message: 'user account is already verified',
                field: 'userId'
            })
        }

        const emailVerificationData = { userId, code: generateVerificationCode() }
        const emailVerificationObj = new EmailVerificationModel(emailVerificationData)
        const newEmailverification = await emailVerificationObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'email verification code created successfully!',
            emailVerification: newEmailverification
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

const sendEmail = async (request, response) => {

    try {

        const mailData = await sendVerificationCode({ receiverEmail: 'moderna.alex.eg@gmail.com', verificationCode: generateVerificationCode() })

        return response.status(200).json({
            accepted: true,
            message: mailData.isSent ? 'email sent successfully!' : 'error sending email'
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
    userSignup,
    userLogin,
    verifyEmailVerificationCode,
    verifyPersonalInfo,
    verifySpecialityInfo,
    verifyEmail,
    setUserVerified,
    addUserEmailVerificationCode,
    sendEmail
}