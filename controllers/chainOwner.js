const chainOwnerValidation = require('../validations/chainOwner')
const ChainOwnerModel = require('../models/ChainOwnerModel')
const bcrypt = require('bcrypt')
const config = require('../config/config')

const addChainOwner = async (request, response) => {

    try {

        const dataValidation = chainOwnerValidation.chainOwnerData(request.body)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, email, phone, countryCode, password } = request.body


        const emailList = await ChainOwnerModel.find({ email })

        if(emailList.length != 0) {
            return response.status(400).json({
                message: 'email is already registered',
                field: 'email'
            })
        }

        const phoneList = await ChainOwnerModel.find({ phone, countryCode })

        if(phoneList.length != 0) {
            return response.status(400).json({
                message: 'phone is already registered',
                field: 'phone'
            })
        }

        const chainOwner = {
            name,
            email,
            phone,
            countryCode,
            password: bcrypt.hashSync(password, config.SALT_ROUNDS),
        }       

        const newChainOwnerObj = new ChainOwnerModel(chainOwner)
        const newChainOwner = await newChainOwnerObj.save()

        newChainOwner.password = null

        return response.status(200).json({
            message: `${name} is added successfully as chain owner in Barbells`,
            newChainOwner
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const getChainOwners = async (request, response) => {

    try {

        const chainOwners = await ChainOwnerModel
        .find()
        .select({ password: 0, __v: 0, updatedAt: 0 })
        .sort({ createdAt: -1 })

        return response.status(200).json({
            chainOwners
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { addChainOwner, getChainOwners }