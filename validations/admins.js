const validator = require('../utils/utils')


const adminSignUp = (bidderData) => {

    const { name, email, password, phone, phoneCountryCode, role } = bidderData

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: 'name entered has invalid characters', field: 'name'  }


    if(!email) return { isAccepted: false, message: 'email is required', field: 'email'  }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email'  } 
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password'  }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'invalid phone formate', field: 'phone' }

    if(!phoneCountryCode) return { isAccepted: false, message: 'phone country code is required', field: 'phoneCountryCode' }

    if(!validator.isPhoneCountryCodeValid(phoneCountryCode)) return { isAccepted: false, message: 'invalid phone country code', field: 'phoneCountryCode' }

    if(!role) return { isAccepted: false, message: 'role is required', field: 'role' }

    if(!validator.isAdminRole(role)) return { isAccepted: false, message: 'invalid admin role', field: 'role' }

    return { isAccepted: true, message: 'data is valid', data: bidderData } 

}


const login = (userData) => {

    const { email, password } = userData

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email' } 
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: userData }

}

module.exports = { adminSignUp } 