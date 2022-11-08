const utils = require('../utils/utils')
const translations = require('../i18n/index')

const addOfferMessage = (offerMessage, lang) => {

    const { clubId, name, message } = offerMessage

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!utils.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!name) return { isAccepted: false, message: translations[lang]['Offer message name is required'], field: 'name' }

    if(!message) return { isAccepted: false, message: translations[lang]['Offer message body is required'], field: 'message' }

    return { isAccepted: true, message: 'data is valid', data: offerMessage }

}


const deleteOfferMessage = (offerMessage) => {

    const { offerMessageId } = offerMessage

    if(!offerMessageId) return { isAccepted: false, message: 'offer message Id is required', field: 'Id' }
    
    if(!utils.isObjectId(offerMessageId)) return { isAccepted: false, message: 'invalid offer message Id', field: 'Id' }

    return { isAccepted: true, message: 'data is valid', data: offerMessage }
}

const updateOfferMessage = (offerMessage, lang) => {

    const { name, message } = offerMessage

    if(!name) return { isAccepted: false, message: translations[lang]['Offer message name is required'], field: 'name' }

    if(!message) return { isAccepted: false, message: translations[lang]['Offer message body is required'], field: 'message' }

    return { isAccepted: true, message: 'data is valid', data: offerMessage }

}

module.exports = { addOfferMessage, deleteOfferMessage, updateOfferMessage }