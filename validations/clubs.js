const validator = require('../utils/utils')


const clubData = (clubData) => {

    const { ownerId, name, description, phone, countryCode, location } = clubData

    if(!ownerId) return { isAccepted: false, message: 'owner Id is required', field: 'ownerId'}

    if(!validator.isObjectId(ownerId)) return { isAccepted: false, message: 'invalid owner Id formate', field: 'ownerId' }

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(!description) return { isAccepted: false, message: 'description is required', field: 'description' }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'phone formate is invalid', field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: 'country code is required', field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: 'invalid country Code', field: 'countryCode' }

    if(!location) return { isAccepted: false, message: 'location is required', field: 'location' }

    const { country, city, address } = location 
    

    if(!country) return { isAccepted: false, message: 'country is required', field: 'country' }

    if(!city) return { isAccepted: false, message: 'city is required', field: 'city' }

    if(!address) return { isAccepted: false, message: 'address is required', field: 'address' }


    return { isAccepted: true, message: 'data is valid', data: clubData }

}

module.exports = { clubData } 