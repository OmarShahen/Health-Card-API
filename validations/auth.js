const validator = require('../utils/utils')
const config = require('../config/config')
const translations = require('../i18n/index')

const doctorSignup = (doctorData) => {

    const { firstName, lastName, email, countryCode, phone, gender, password, speciality } = doctorData


    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!validator.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'Last name is required', field: 'lastName' }

    if(!validator.isNameValid(lastName)) return { isAccepted: false, message: 'Invalid name formate', field: 'lastName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(!countryCode) return { isAccepted: false, message: 'Country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'Invalid country code', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }
    
    if(typeof phone != 'number') return { isAccepted: false, message: 'Phone formate is invalid', field: 'phone' }

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }

    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }

    if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

    if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

    if(speciality.length == 0) return { isAccepted: false, message: 'Speciality must be atleast one', field: 'speciality' }

    return { isAccepted: true, message: 'data is valid', data: doctorData }

}

const doctorLogin = (doctorData) => {

    const { countryCode, phone, password } = doctorData

    if(!countryCode) return { isAccepted: false, message: 'Country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'Invalid country code', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }
    
    if(typeof phone != 'number') return { isAccepted: false, message: 'Phone formate is invalid', field: 'phone' }

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: doctorData }

}

module.exports = { doctorSignup, doctorLogin } 