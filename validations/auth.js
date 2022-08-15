const validator = require('../utils/utils')


const adminLogin = (adminData) => {

    const { email, password } = adminData

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email' } 
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: adminData }

}

const staffLogin = (staffData) => {

    const { phone, phoneCountryCode, password } = staffData

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'invalid phone formate', field: 'phone' }
    
    if(!phoneCountryCode) return { isAccepted: false, message: 'phone country code is required', field: 'phoneCountryCode' }

    if(!validator.isPhoneCountryCodeValid(phoneCountryCode)) return { isAccepted: false, message: 'invalid phone country code', field: 'phoneCountryCode' }
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: staffData }

}

module.exports = { adminLogin, staffLogin } 