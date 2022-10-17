const validator = require('../utils/utils')
const translations = require('../i18n/index')

const clubData = (clubData, lang) => {

    const { ownerId, name, description, phone, countryCode, location } = clubData

    if(!ownerId) return { isAccepted: false, message: 'owner Id is required', field: 'ownerId'}

    if(!validator.isObjectId(ownerId)) return { isAccepted: false, message: 'invalid owner Id formate', field: 'ownerId' }

    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!description) return { isAccepted: false, message: translations[lang]['Description is required'], field: 'description' }

    if(!phone) return { isAccepted: false, message: translations[lang]['Phone is required'], field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: translations[lang]['Phone formate is invalid'], field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: translations[lang]['Country code is required'], field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: translations[lang]['Invalid country Code'], field: 'countryCode' }

    if(!location) return { isAccepted: false, message: translations[lang]['Location is required'], field: 'location' }

    const { country, city, address } = location 
    

    if(!country) return { isAccepted: false, message: translations[lang]['Country is required'], field: 'country' }

    if(!city) return { isAccepted: false, message: translations[lang]['City is required'], field: 'city' }

    if(!address) return { isAccepted: false, message: translations[lang]['Address is required'], field: 'address' }


    return { isAccepted: true, message: 'data is valid', data: clubData }

}

const updateClubData = (clubData, lang) => {

    const { description, phone, countryCode } = clubData

    if(!description) return { isAccepted: false, message: translations[lang]['Description is required'], field: 'description' }

    if(!phone) return { isAccepted: false, message: translations[lang]['Phone is required'], field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: translations[lang]['Phone formate is invalid'], field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: translations[lang]['Country code is required'], field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: translations[lang]['Invalid country Code'], field: 'countryCode' }
    

    return { isAccepted: true, message: 'data is valid', data: clubData }

}

module.exports = { clubData, updateClubData } 