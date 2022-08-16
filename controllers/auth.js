const config = require('../config/config')
const authValidation = require('../validations/auth')
const AdminModel = require('../models/AdminModel')
const ClubModel = require('../models/ClubModel')
const StaffModel = require('../models/StaffModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const adminLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.adminLogin(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { email, password } = request.body

        const adminsMailList = await AdminModel.find({ email })

        if(adminsMailList.length == 0) {

            return response.status(401).json({
                message: 'email does not exist',
                field: 'email'
            })
        }


        if(!bcrypt.compareSync(password, adminsMailList[0].password)) {

            return response.status(401).json({
                message: 'wrong password',
                field: 'password'
            })
        }

        const admin  = {
            _id: adminsMailList[0]._id,
            email: adminsMailList[0].email,
            phone: adminsMailList[0].phone,
            countryCode: adminsMailList[0].countryCode,
            role: adminsMailList[0].role,
            createdAt: adminsMailList[0].createdAt
        }

        admin.user = 'ADMIN'

        const token = jwt.sign(admin, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            admin: admin,
            token
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const staffLogin = async (request, response) => {

    try {

        const dataValidation = authValidation.staffLogin(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { phone, countryCode, password } = request.body

        const staffList = await StaffModel
        .find({ phone, countryCode })

        if(staffList.length == 0) {
            return response.status(400).json({
                message: 'phone number is not registered',
                field: 'phone'
            })
        }

        if(!bcrypt.compareSync(password, staffList[0].password)) {
            return response.status(400).json({
                message: 'wrong password',
                field: 'password'
            })
        }


        const token = jwt.sign(staffList[0]._doc, config.SECRET_KEY, { expiresIn: '30d' })

        return response.status(200).json({
            token: token,
            staff: staffList[0]
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = {
    adminLogin,
    staffLogin
}