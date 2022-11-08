const OfferMessageModel = require('../models/OfferMessageModel')
const ClubModel = require('../models/ClubModel')
const validator = require('../validations/offersMessages')
const translations = require('../i18n/index')

const getClubOffersMessages = async (request, response) => {

    try {

        const { clubId } = request.params

        const offersMessages = await OfferMessageModel
        .find({ clubId })
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            offersMessages
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

const addOfferMessage = async (request, response) => {

    try {

        const { lang } = request.query

        const dataValidation = validator.addOfferMessage(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { clubId, name, message } = request.body

        const club = await ClubModel.findById(clubId)

        if(!club) {
            return response.status(400).json({
                accepted: false,
                message: 'club Id is not registered',
                field: 'clubId'
            })
        }

        const offersMessagesNameList = await OfferMessageModel.find({ clubId, name })

        if(offersMessagesNameList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Offer message name is already registered'],
                field: 'name'
            })
        }

        const newOfferMessageData = { clubId, name, message }

        const offerMessageObj = new OfferMessageModel(newOfferMessageData)
        const newOfferMessage = await offerMessageObj.save()


        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Offer message is added successfully'],
            newOfferMessage
        })

    } catch(error) {
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteOfferMessage = async (request, response) => {

    try {

        const { lang } = request.query
        const { offerMessageId } = request.params

        const dataValidation = validator.deleteOfferMessage(request.params)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const deletedOfferMessage = await OfferMessageModel.findByIdAndDelete(offerMessageId)

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Offer message is deleted successfully'],
            deletedOfferMessage
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

const updateOfferMessage = async (request, response) => {

    try {

        const { lang } = request.query
        const { offerMessageId } = request.params

        const dataValidation = validator.updateOfferMessage(request.body, lang)

        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: false,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { name, message } = request.body

        const offerMessage = await OfferMessageModel.findById(offerMessageId)

        if(!offerMessage) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid offer message Id',
                field: 'offerMessageId'
            })
        }

        if(offerMessage.name != name) {

            const offersMessagesNamesList = await OfferMessageModel
            .find({ clubId: offerMessage.clubId, name })

            if(offersMessagesNamesList.length == 1) {
                return response.status(400).json({
                    accepted: false,
                    message: translations[lang]['Offer message name is already registered'],
                    field: 'name'
                })
            }
        }

        const updatedOfferMessage = await OfferMessageModel
        .findByIdAndUpdate(offerMessage._id, { name, message }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Offer message is updated successfully'],
            updatedOfferMessage
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

module.exports = { getClubOffersMessages, addOfferMessage, deleteOfferMessage, updateOfferMessage }