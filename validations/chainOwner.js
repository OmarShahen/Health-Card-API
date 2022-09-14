const validator = require('../utils/utils')


const chainOwnerData = (chainOwnerData) => {

    const { name, email, phone, countryCode, password } = chainOwnerData


    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: 'invalid name formate', field: 'name' }

    if(name.split(' ').length != 2) return { isAccepted: false, message: 'name must be 2 words', field: 'name' }

    if(email) {
        if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'email formate is invalid', field: 'email' }
    }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'phone formate is invalid', field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: 'country code is required', field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: 'invalid country Code', field: 'countryCode' }

    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }


    return { isAccepted: true, message: 'data is valid', data: chainOwnerData }

}




module.exports = { chainOwnerData } 