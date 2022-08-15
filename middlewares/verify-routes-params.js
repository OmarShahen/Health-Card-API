const utils = require('../utils/utils')
const ClubModel = require('../models/ClubModel')
const RegistrationModel = require('../models/RegistrationModel')

const verifyClubId = async (request, response, next) => {

    try {

        const { clubId } = request.params

        if(!utils.isObjectId(clubId)) {
            return response.status(400).json({
                message: 'invalid club Id formate',
                field: 'clubId'
            })
        }

        const clubList = await ClubModel.find({ _id: clubId })

        if(clubList.length == 0) {
            return response.status(404).json({
                message: 'club Id does not exist',
                field: 'clubId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}

const verifyRegistrationId = async (request, response, next) => {

    try {

        const { registrationId } = request.params

        if(!utils.isObjectId(registrationId)) {
            return response.status(400).json({
                message: 'invalid registration Id formate',
                field: 'registrationId'
            })
        }

        const registrationList = await RegistrationModel.find({ _id: registrationId })

        if(registrationList.length == 0) {
            return response.status(404).json({
                message: 'registration Id does not exist',
                field: 'registrationId'
            })
        }

        return next()

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            message: 'internal server error',
            error: error.message
        })
    }
}


module.exports = { verifyClubId, verifyRegistrationId }