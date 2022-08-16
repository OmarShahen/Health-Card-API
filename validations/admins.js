const validator = require('../utils/utils')


const adminSignUp = (adminData) => {

    const { name, email, password, phone, countryCode, role } = adminData

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: 'name entered has invalid characters', field: 'name'  }

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email'  }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email'  } 
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password'  }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'invalid phone formate', field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: 'country code is required', field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: 'invalid country code', field: 'countryCode' }

    if(!role) return { isAccepted: false, message: 'role is required', field: 'role' }

    if(!validator.isAdminRole(role)) return { isAccepted: false, message: 'invalid admin role', field: 'role' }

    return { isAccepted: true, message: 'data is valid', data: adminData } 

}


const login = (userData) => {

    const { email, password } = userData

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email' } 
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: userData }

}

module.exports = { adminSignUp } 