const validator = require('../utils/utils')


const clubData = (clubData) => {

    const { clubId, name, phone, phoneCountryCode, location } = clubData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'phone formate is invalid', field: 'phone' }

    if(!phoneCountryCode) return { isAccepted: false, message: 'phone country code is required', field: 'phoneCountryCode' }

    if(!validator.isPhoneCountryCodeValid(phoneCountryCode)) return { isAccepted: false, message: 'invalid phoneCountryCode', field: 'phoneCountryCode' }

    if(!location) return { isAccepted: false, message: 'location is required', field: 'location' }

    const { country, city, address } = location 
    

    if(!country) return { isAccepted: false, message: 'country is required', field: 'country' }

    if(!city) return { isAccepted: false, message: 'city is required', field: 'city' }

    if(!address) return { isAccepted: false, message: 'address is required', field: 'address' }


    return { isAccepted: true, message: 'data is valid', data: clubData }

}

module.exports = { clubData } 