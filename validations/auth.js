const validator = require('../utils/utils')


const adminLogin = (adminData) => {

    const { email, password } = adminData

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email' } 
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: adminData }

}

const staffLogin = (staffData) => {

    const { phone, countryCode, password } = staffData
   
    if(!countryCode) return { isAccepted: false, message: 'country code is required', field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: 'invalid country code', field: 'countryCode' }
    
    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'invalid phone formate', field: 'phone' }
 
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: staffData }

}

const chainOwnerLogin = (chainOwnerData) => {

    const { phone, countryCode, password } = chainOwnerData

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: 'invalid phone formate', field: 'phone' }
    
    if(!countryCode) return { isAccepted: false, message: 'country code is required', field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: 'invalid country code', field: 'countryCode' }
    
    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: chainOwnerData }

}



module.exports = { adminLogin, staffLogin, chainOwnerLogin } 