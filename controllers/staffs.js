const config = require('../config/config')
const staffValidation = require('../validations/staffs')
const ClubModel = require('../models/ClubModel')
const StaffModel = require('../models/StaffModel')
const bcrypt = require('bcrypt')

const addClubOwner = async (request, response) => {

    try {

        const dataValidation = staffValidation.staffData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, name, email, phone, phoneCountryCode, password } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        const emailList = await StaffModel.find({ clubId, email })

        if(emailList.length != 0) {
            return response.status(400).json({
                message: 'email is already registered',
                field: 'email'
            })
        }

        const phoneList = await StaffModel.find({ clubId, phone, phoneCountryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already registered',
                field: 'phone'
            })
        }

        const owner = {
            clubId,
            name,
            email,
            phone,
            phoneCountryCode,
            password: bcrypt.hashSync(password, config.SALT_ROUNDS),
            role: 'OWNER'
        }       
        
        const ownerObj = new StaffModel(owner)
        const newOwner = await ownerObj.save()

        return response.status(200).json({
            message: `${name} is added successfully as club owner`,
            newOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const addStaff = async (request, response) => {

    try {


        const dataValidation = staffValidation.staffData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, name, email, phone, phoneCountryCode, password } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        if(email) {
            
            const emailList = await StaffModel.find({ clubId, email })

            if(emailList.length != 0) {
                return response.status(400).json({
                    message: 'email is already registered',
                    field: 'email'
                })
            }
        }

        const phoneList = await StaffModel.find({ clubId, phone, phoneCountryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already registered',
                field: 'phone'
            })
        }

        const staff = {
            clubId,
            name,
            email,
            phone,
            phoneCountryCode,
            password: bcrypt.hashSync(password, config.SALT_ROUNDS),
            role: 'STAFF'
        }       
        
        const staffObj = new StaffModel(staff)
        const newStaff = await staffObj.save()

        return response.status(200).json({
            message: `${name} is added successfully as club staff`,
            newStaff
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addClubOwner, addStaff }
