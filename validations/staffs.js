const validator = require('../utils/utils')


const staffData = (staffData) => {

    const { clubId, name, email, phone, countryCode, password } = staffData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: 'invalid name formate', field: 'name' }

    if(name.split(' ').length != 2) return { isAccepted: false, message: 'name must be 2 words', field: 'name' }

    if(email) {
        if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'email formate is invalid', field: 'email' }
    }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'phone formate is invalid', field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: 'country code is required', field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: 'invalid country code', field: 'countryCode' }

    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }


    return { isAccepted: true, message: 'data is valid', data: staffData }

}

const updateStaffData = (staffData) => {

    const { name, email, phone, countryCode } = staffData

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: 'invalid name formate', field: 'name' }

    if(name.split(' ').length != 2) return { isAccepted: false, message: 'name must be 2 words', field: 'name' }

    if(email) {
        if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'email formate is invalid', field: 'email' }
    }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'phone formate is invalid', field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: 'country code is required', field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: 'invalid country code', field: 'countryCode' }

    return { isAccepted: true, message: 'data is valid', data: staffData }

}

module.exports = { staffData, updateStaffData } 