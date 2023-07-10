const CardModel = require('../models/CardModel')
const cardValidation = require('../validations/cards')
const PatientModel = require('../models/PatientModel')

const getCards = async (request, response) => {
    
    try {

        const cards = await CardModel
        .find()
        .sort({ createdAt: -1 })

        return response.status(200).json({
            accepted: true,
            cards
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

const addCard = async (request, response) => {
    
    try {

        const dataValidation = cardValidation.addCard(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { cardId, cvc } = request.body

        const cardsList = await CardModel.find({ cardId })
        if(cardsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'card Id is already registered',
                field: 'cardId'
            })
        }

        const cardData = { cardId, cvc }
        const cardObj = new CardModel(cardData)
        const newCard = await cardObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Added card successfully!',
            card: newCard
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

const updateCardActivity = async (request, response) => {
    
    try {

        const { cardId } = request.params

        const dataValidation = cardValidation.updateCardActivity(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { isActive } = request.body

        const updatedCard = await CardModel.updateOne({ cardId }, { isActive })

        return response.status(200).json({
            accepted: true,
            message: 'Updated card activity successfully!',
            card: updatedCard
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

const deleteCard = async (request, response) => {
    
    try {

        const { cardId } = request.params

        const patientsList = await PatientModel.find({ cardId })
        if(patientsList.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'card Id is registered with patient',
                field: 'cardId'
            })
        }

        const deletedCard = await CardModel.deleteOne({ cardId })

        return response.status(200).json({
            accepted: true,
            message: 'Deleted card successfully!',
            card: deletedCard
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

module.exports = { getCards, addCard, updateCardActivity, deleteCard }