const config = require('../config/config')
const adminValidation = require('../validations/admins')
const AdminModel = require('../models/AdminModel')
const bcrypt = require('bcrypt')

const addAdmin = async (request, response) => {

    try {

        const dataValidation = adminValidation.adminSignUp(request.body)

        if(!dataValidation.isAccepted) {

            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, email, password, phone, countryCode, role } = request.body

        const emailList = await AdminModel.find({ email })

        if(emailList.length != 0) {
            return response.status(400).json({
                message: 'email is already used',
                field: 'email'
            })
        }

        const phoneList = await AdminModel.find({ phone })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already used',
                field: 'phone'
            })
        }


        const admin = {
            name,
            email,
            phone,
            countryCode,
            password: bcrypt.hashSync(password, config.SALT_ROUNDS),
        }

        const adminObj = new AdminModel(admin)
        const newAdmin = await adminObj.save()

        newAdmin.password = null

        return response.status(200).json({
            message: `${role} admin added successfully`,
            admin: newAdmin,
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
    addAdmin,
}