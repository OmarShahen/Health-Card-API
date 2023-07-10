const config = require('../config/config')
const authValidation = require('../validations/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserModel = require('../models/UserModel')
const ClinicModel = require('../models/ClinicModel')
const CounterModel = require('../models/CounterModel')
const ClinicRequestModel = require('../models/ClinicRequestModel')
const SpecialityModel = require('../models/SpecialityModel')
const EmailVerificationModel = require('../models/EmailVerificationModel')
const { generateVerificationCode } = require('../utils/random-number')
const utils = require('../utils/utils')
const { sendVerificationCode } = require('../mails/verification-code')
const { sendForgotPasswordVerificationCode } = require('../mails/forgot-password')
const { sendDeleteAccountCode } = require('../mails/delete-account')

const userSignup = async (request, response) => {

    try {

        const dataValidation = authValidation.signup(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password, speciality, roles } = request.body

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Email is already registered',
                field: 'email'
            })
        }

        let specialitiesList = []

        if(roles.includes('DOCTOR')) {
            specialitiesList = await SpecialityModel.find({ _id: { $in: speciality } })
            if(specialitiesList.length != speciality.length) {
                return response.status(400).json({
                    accepted: false,
                    message: 'invalid specialities Ids',
                    field: 'speciality'
                })
            }
        }

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'user' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        request.body.speciality = specialitiesList.map(special => special._id)

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

        return response.status(200).json({
            accepted: true,
            message: 'Account created successfully!',
            mailSuccess: mailData.isSent,
            message: mailData.isSent ? 'email is sent successfully!' : 'there was a problem sending your email',
            user: newUser,
            emailVerification: newEmailVerification,
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

        const dataValidation = authValidation.login(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const userList = await UserModel
        .find({ email, isverified: true })

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

        const formattedUser = { ...user._doc }

        const updatedUser = await UserModel.findByIdAndUpdate(user._id, { lastLoginDate: new Date() }, { new: true })

        if(user.roles.includes('STAFF')) {
            const userClinic = await ClinicModel.findById(user.clinicId)
            formattedUser.clinic = userClinic
        }

        updatedUser.password = undefined

        const token = jwt.sign(user._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            accepted: true,
            token: token,
            user: updatedUser,
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

        const token = jwt.sign(updatedUser._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            accepted: true,
            message: 'account has been verified successfully!',
            user: updatedUser,
            deletedCodes: deleteCodes.deletedCount,
            token
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

const verifyDemographicInfo = async (request, response) => {

    try {

        const dataValidation = authValidation.verifyDemographicInfo(request.body)
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

        const mailData = await sendVerificationCode({ receiverEmail: 'omarredaelsayedmohamed@gmail.com', verificationCode: generateVerificationCode() })

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

const forgotPassword = async (request, response) => {

    try {

        const dataValidation = authValidation.forgotPassword(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email } = request.body

        const emailList = await UserModel.find({ email, isVerified: true })
        if(emailList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'email is not registered',
                field: 'email'
            })
        }

        const user = emailList[0]
        const verificationCode = generateVerificationCode()
        const verificationData = {
            resetPassword: {
                verificationCode: verificationCode,
                expirationDate: Date.now() + 3600000 // 1 hour
            }   
        }

        const updatedUserPromise = UserModel
        .findByIdAndUpdate(user._id, verificationData, { new: true })

        const forgotPasswordData = { receiverEmail: email, verificationCode }
        const sendEmailPromise = sendForgotPasswordVerificationCode(forgotPasswordData)

        const [updatedUser, sendEmail] = await Promise.all([
            updatedUserPromise,
            sendEmailPromise
        ])

        if(!sendEmail.isSent) {
            return response.status(400).json({
                accepted: false,
                message: 'There was a problem sending your email',
                field: 'isSent'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'Verification code is sent successfully!',
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

const sendUserDeleteAccountVerificationCode = async (request, response) => {

    try {

        const { userId } = request.params

        const user = await UserModel.findById(userId)

        if(!user.roles.includes('STAFF')) {
            return response.status(400).json({
                accepted: false,
                message: 'your account is with a role that cannot be deleted',
                field: 'userId'
            })
        }

        const verificationCode = generateVerificationCode()
        const verificationData = {
            deleteAccount: {
                verificationCode: verificationCode,
                expirationDate: Date.now() + 3600000 // 1 hour
            }   
        }

        const updatedUserPromise = UserModel
        .findByIdAndUpdate(user._id, verificationData, { new: true })

        const deleteAccountData = { receiverEmail: user.email, verificationCode }
        const sendEmailPromise = sendDeleteAccountCode(deleteAccountData)

        const [updatedUser, sendEmail] = await Promise.all([
            updatedUserPromise,
            sendEmailPromise
        ])

        if(!sendEmail.isSent) {
            return response.status(400).json({
                accepted: false,
                message: 'There was a problem sending your email',
                field: 'isSent'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'Verification code is sent successfully!',
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

const verifyDeleteAccountVerificationCode = async (request, response) => {

    try {

        const { userId, verificationCode } = request.params

        const userList = await UserModel
        .find({ 
            _id: userId, 
            isVerified: true, 
            'deleteAccount.verificationCode': verificationCode, 
            'deleteAccount.expirationDate': { $gt: Date.now() } 
        })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'verification code is not registered',
                field: 'verificationCode'
            })
        }

        const user = userList[0]

        if(user.roles.includes('STAFF')) {
            const deleteClinicRequests = await ClinicRequestModel.deleteMany({ userId })
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId)

        return response.status(200).json({
            accepted: true,
            message: 'User account is deleted successfully!',
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

const verifyResetPasswordVerificationCode = async (request, response) => {

    try {

        const dataValidation = authValidation.verifyResetPasswordVerificationCode(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, verificationCode } = request.body

        const userList = await UserModel
        .find({ 
            email, 
            isVerified: true, 
            'resetPassword.verificationCode': verificationCode, 
            'resetPassword.expirationDate': { $gt: Date.now() } 
        })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'verification code is not registered',
                field: 'verificationCode'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'verification code is verified!',
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

const resetPassword = async (request, response) => {

    try {

        const dataValidation = authValidation.resetPassword(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, verificationCode, password } = request.body

        const userList = await UserModel
        .find({ 
            email, 
            isVerified: true, 
            'resetPassword.verificationCode': verificationCode, 
            'resetPassword.expirationDate': { $gt: Date.now() } 
        })

        if(userList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'verification code is not registered',
                field: 'verificationCode'
            })
        }

        const user = userList[0]
        const userId = user._id

        if(bcrypt.compareSync(password, user.password)) {
            return response.status(400).json({
                accepted: false,
                message: 'enter a new password to the current one',
                field: 'password'
            })
        }

        const newUserPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)


        const updateUserData = {
            password: newUserPassword,
            resetPassword: { verificationCode: null, expirationDate: null }
        }

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, updateUserData, { new: true })

        updatedUser.password = undefined

        return response.status(200).json({
            accepted: true,
            message: 'updated user password successfully!',
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

module.exports = {
    userSignup,
    userLogin,
    verifyEmailVerificationCode,
    verifyPersonalInfo,
    verifyDemographicInfo,
    verifySpecialityInfo,
    verifyEmail,
    setUserVerified,
    addUserEmailVerificationCode,
    sendEmail,
    forgotPassword,
    resetPassword,
    verifyResetPasswordVerificationCode,
    sendUserDeleteAccountVerificationCode,
    verifyDeleteAccountVerificationCode
}