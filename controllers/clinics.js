const ClinicModel = require('../models/ClinicModel')
const UserModel = require('../models/UserModel')
const clinicValidation = require('../validations/clinics')

const addClinic = async (request, response) => {

    try {

        const dataValidation = clinicValidation.addClinic(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { ownerId, countryCode, phone } = request.body

        const owner = await UserModel.findById(ownerId)
        if(!owner) {
            return response.status(400).json({
                accepted: false,
                message: 'Owner Id does not exist',
                field: 'ownerId'
            })
        }

        const phoneList = await ClinicModel.find({ countryCode, phone })
        if(phoneList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Phone is already registered',
                field: 'phone'
            })
        }

        const clinicData = { ...request.body, owners: [ownerId] }
        
        const clinicObj = new ClinicModel(clinicData)
        const newClinic = await clinicObj.save()
        
        return response.status(200).json({
            accepted: true,
            message: 'Added clinic successfully!',
            clinic: newClinic
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

const getClinics = async (request, response) => {

    try {

        const clinics = await ClinicModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            clinics
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

module.exports = { addClinic, getClinics }