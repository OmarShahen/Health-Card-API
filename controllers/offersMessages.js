const OfferMessageModel = require('../models/OfferMessageModel')
const ClubModel = require('../models/ClubModel')
const MemberModel = require('../models/MemberModel')
const validator = require('../validations/offersMessages')
const translations = require('../i18n/index')
const { sendOfferMessage } = require('../APIs/whatsapp/send-offer-message')
const config = require('../config/config')

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
            offerMessage: updatedOfferMessage
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

const sendOfferMessageToMember = async (request, response) => {

    try {

        const { lang } = request.query
        const { memberId } = request.params
        const { message, languageCode } = request.body

        if(!message) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Message is required'],
                field: 'message'
            })
        }

        if(!languageCode) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Language is required'],
                field: 'languageCode'
            })
        }

        if(!config.WHATSAPP.LANGUAGES.includes(languageCode)) {
            return response.status(400).json({
                accepted: false,
                message: 'Invalid language code',
                field: 'languageCode'
            })
        }

        const member = await MemberModel.findById(memberId)
        const club = await ClubModel.findById(member.clubId)

        if(!club.image) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Club has no image to send offer with'],
                field: 'clubId'
            })
        }

        const memberPhone = member.countryCode + member.phone

        const messageResponse = await sendOfferMessage(
            memberPhone,
            languageCode,
            club.image,
            club.name,
            member.name,
            message
        )

        if(messageResponse.isSent == false) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['There is a problem in sending offer message'],
            })
        }

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Offer message is sent successfully'],
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
    getClubOffersMessages, 
    addOfferMessage, 
    deleteOfferMessage, 
    updateOfferMessage,
    sendOfferMessageToMember
}