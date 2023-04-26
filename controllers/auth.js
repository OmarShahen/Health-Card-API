const config = require('../config/config')
const authValidation = require('../validations/auth')
const utils = require('../utils/utils')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const translations = require('../i18n/index')
const mails = require('../mails/reset-password')
const UserModel = require('../models/UserModel')

const doctorSignup = async (request, response) => {

    try {

        const dataValidation = authValidation.doctorSignup(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { firstName, lastName, email, countryCode, phone, password, gender, speciality } = request.body

        const emailList = await UserModel.find({ role: 'DOCTOR', email })
        if(emailList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Email is already registered',
                field: 'email'
            })
        }

        const phoneList = await UserModel.find({ role: 'DOCTOR', countryCode, phone })
        if(phoneList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Phone is already registered',
                field: 'phone'
            })
        }   

        const doctorPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)
        const doctorData = { ...request.body, role: 'DOCTOR', password: doctorPassword }

        const doctorObj = new UserModel(doctorData)
        const newDoctor = await doctorObj.save()

        newDoctor.password = undefined
        const token = jwt.sign({ user: newDoctor }, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            accepted: true,
            message: 'Account created successfully!',
            user: newDoctor,
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


const doctorLogin = async (request, response) => {

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

        const userList = await UserModel.find({ email })

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

const clubAdminLogin = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = authValidation.staffLogin(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { phone, countryCode, password } = request.body

        const clubAdminList = await StaffModel
        .find({ phone, countryCode, isAccountActive: true, role: 'CLUB-ADMIN' })

        if(clubAdminList.length == 0) {
            return response.status(404).json({
                message: translations[lang]['Account does not exists'],
                field: 'phone'
            })
        }

        if(!bcrypt.compareSync(password, clubAdminList[0].password)) {
            return response.status(400).json({
                message: translations[lang]['Wrong password'],
                field: 'password'
            })
        }

        clubAdminList[0].password = null

        const club = await ClubModel.findById(clubAdminList[0].clubId)

        const token = jwt.sign(clubAdminList[0]._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            token,
            club,
            clubAdmin: clubAdminList[0]
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const chainOwnerLogin = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = authValidation.chainOwnerLogin(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { phone, countryCode, password } = request.body

        const chainOwnerList = await ChainOwnerModel
        .find({ phone, countryCode, isAccountActive: true })

        if(chainOwnerList.length == 0) {
            return response.status(404).json({
                message: translations[lang]['Account does not exists'],
                field: 'phone'
            })
        }

        if(!bcrypt.compareSync(password, chainOwnerList[0].password)) {
            return response.status(400).json({
                message: translations[lang]['Wrong password'],
                field: 'password'
            })
        }

        chainOwnerList[0].password = null

        let chainOwner = chainOwnerList[0]

        const ownedClubs = await ClubModel.aggregate([
            {
                $match: {
                    _id: { $in: chainOwner.clubs }
                }
            }
        ])

        chainOwner.clubs = ownedClubs


        const token = jwt.sign(chainOwnerList[0]._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            token,
            chainOwner: chainOwnerList[0]
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const sendStaffResetPasswordMail = async (request, response) => {

    try {

        const { lang } = request.query
        const { email } = request.body

        const dataValidation = authValidation.resetPasswordMail(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const emailList = await StaffModel.find({ email, isAccountActive: true })

        if(emailList.length == 0) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Email is not registered'],
                field: 'email'
            })
        }

        const user = emailList[0]
        const token = jwt.sign({ userId: user._id, role: user.role }, config.SECRET_KEY, { expiresIn: '24h' })

        const userData = {
            name: user.name,
            email: user.email,
            token: token
        }

        const mailStatus = await mails.sendResetPassword(userData, lang)

        if(!mailStatus.isSent) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['There was a problem sending your email'],
                field: 'email'
            })
        }


        return response.status(200).json({
            accepted: true,
            message: translations[lang][`Email is sent successfully!`],
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

const verifyToken = (request, response) => {

    try {

        const { token } = request.body

        if(!token) {
            return response.status(400).json({
                accepted: false,
                message: 'token is required',
                field: 'token'
            })
        }

        jwt.verify(token, config.SECRET_KEY, (error, data) => {

            if(error) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Invalid token',
                    field: 'token'
                })
            }

            return response.status(200).json(data)
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

        const { lang } = request.query
        const { password } = request.body

        if(!password) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Password is required'],
                field: 'password'
            })
        }

        const userId = request.user.userId
        const role = request.user.role

        let user

        if(role == 'STAFF' || role == 'CLUB-ADMIN') {
            user = await StaffModel.findById(userId)
        } else if(role == 'OWNER') {
            user = await ChainOwnerModel.findById(userId)
        }

        if(!user) {
            return response.status(400).json({
                accepted: false,
                message: 'user Id does not exist',
                field: 'memberId'
            })
        }


        if(bcrypt.compareSync(password, user.password)) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Your new password cannot be the same as your old one'],
                field: 'password'
            })
        }

        const newPassword = bcrypt.hashSync(password, config.SALT_ROUNDS)

        let updatedUser

        if(role == 'STAFF' || role == 'CLUB-ADMIN') {
            updatedUser = await StaffModel
            .findByIdAndUpdate(userId, { password: newPassword }, { new: true })
        } else if(role == 'OWNER') {
            updatedUser = await ChainOwnerModel
            .findByIdAndUpdate(userId, { password: newPassword }, { new: true })
        }

        return response.status(200).json({
            accepted: true,
            role: role,
            message: translations[lang]['Password changed successfully'],
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error'
        })
    }
}

const sendChainOwnerResetPasswordMail = async (request, response) => {

    try {

        const { lang } = request.query
        const { email } = request.body

        const dataValidation = authValidation.resetPasswordMail(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const emailList = await ChainOwnerModel.find({ email, isAccountActive: true })

        if(emailList.length == 0) {
            return response.status(404).json({
                accepted: false,
                message: translations[lang]['Email is not registered']
            })
        }

        const user = emailList[0]
        const token = jwt.sign({ userId: user._id, role: 'OWNER' }, config.SECRET_KEY, { expiresIn: '24h' })

        const userData = {
            name: user.name,
            email: user.email,
            token: token
        }

        const mailStatus = await mails.sendResetPassword(userData, lang)

        if(!mailStatus.isSent) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['There was a problem sending your email']
            })
        }


        return response.status(200).json({
            accepted: true,
            message: translations[lang][`Email is sent successfully!`],
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
    doctorSignup,
    doctorLogin
}