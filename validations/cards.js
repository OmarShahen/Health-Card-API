const utils = require('../utils/utils')

const addCard = (cardData) => {

    const { cardId, cvc } = cardData

    if(!cardId) return { isAccepted: false, message: 'card Id is required', field: 'cardId' }

    if(typeof cardId != 'number') return { isAccepted: false, message: 'card Id format is invalid', field: 'cardId' }

    if(!cvc) return { isAccepted: false, message: 'cvc is required', field: 'cvc' }

    if(typeof cvc != 'number') return { isAccepted: false, message: 'cvc format is invalid', field: 'cvc' }

    
    return { isAccepted: true, message: 'data is valid', data: cardData }

}

const updateCardActivity = (cardData) => {

    const { isActive } = cardData

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive is required', field: 'isActive' }

    
    return { isAccepted: true, message: 'data is valid', data: cardData }

}

module.exports = { addCard, updateCardActivity }