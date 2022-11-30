const utils = require('../utils/utils')
const translations = require('../i18n/index')

const addOfferMessage = (offerMessage, lang) => {

    const { name, message, languageCode } = offerMessage

    if(!name) return { isAccepted: false, message: translations[lang]['Offer message name is required'], field: 'name' }

    if(!message) return { isAccepted: false, message: translations[lang]['Offer message body is required'], field: 'message' }

    if(!languageCode) return { isAccepted: false, message: translations[lang]['Language code is required'], field: 'languageCode' }

    if(!utils.isWhatsappLanguageValid(languageCode)) return { isAccepted: false, message: translations[lang]['Invalid language code'], field: 'languageCode' }

    return { isAccepted: true, message: 'data is valid', data: offerMessage }

}


const deleteOfferMessage = (offerMessage) => {

    const { offerMessageId } = offerMessage

    if(!offerMessageId) return { isAccepted: false, message: 'offer message Id is required', field: 'Id' }
    
    if(!utils.isObjectId(offerMessageId)) return { isAccepted: false, message: 'invalid offer message Id', field: 'Id' }

    return { isAccepted: true, message: 'data is valid', data: offerMessage }
}

const updateOfferMessage = (offerMessage, lang) => {

    const { name, message, languageCode } = offerMessage

    if(!name) return { isAccepted: false, message: translations[lang]['Offer message name is required'], field: 'name' }

    if(!message) return { isAccepted: false, message: translations[lang]['Offer message body is required'], field: 'message' }
    
    if(!languageCode) return { isAccepted: false, message: translations[lang]['Language code is required'], field: 'languageCode' }

    if(!utils.isWhatsappLanguageValid(languageCode)) return { isAccepted: false, message: translations[lang]['Invalid language code'], field: 'languageCode' }

    return { isAccepted: true, message: 'data is valid', data: offerMessage }

}

const sendOfferMessageToMembers = (data) => {

    const { members, message, languageCode } = data

    if(!languageCode) return { isAccepted: false, message: 'Language code is required', field: 'languageCode' }

    if(!utils.isWhatsappLanguageValid(languageCode)) return { isAccepted: false, message: 'Invalid language code', field: 'languageCode' }


    if(!message) return { isAccepted: false, message: 'Message is required', field: 'message' }
    
    if(!Array.isArray(members)) return { isAccepted: false, message: 'Members must be a list', field: 'members' }

    for(let i=0;i<members.length;i++) {

        const member = members[i]

        if(!member.countryCode) return { isAccepted: false, message: 'Country code in member is missing', field: 'members.countryCode' }

        if(!utils.isCountryCodeValid(member.countryCode)) return { isAccepted: false, message: 'Country code is invalid', field: 'members.countryCode' }

        if(!member.phone) return { isAccepted: false, message: 'Phone in member is missing', field: 'members.phone' }

        if(!utils.isPhoneValid(member.phone)) return { isAccepted: false, message: 'Invalid phone formate', field: 'members.phone' }

        if(!member.name) return { isAccepted: false, message: 'Name in member is missing', field: 'members.name' }

        if(!utils.isNameValid(member.name)) return { isAccepted: false, message: 'Invalid name formate', field: 'members.name' }
        
    }
    
    return { isAccepted: true, message: 'data is valid', data }
}

module.exports = { addOfferMessage, deleteOfferMessage, updateOfferMessage, sendOfferMessageToMembers }