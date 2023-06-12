const validator = require('../utils/utils')
const config = require('../config/config')
const translations = require('../i18n/index')

const checkSpeciality = (specialities) => {
    for(let i=0;i<specialities.length;i++) {
        if(!validator.isObjectId(specialities[i])) {
            return false
        }
    }

    return true
}

const doctorSignup = (doctorData) => {

    const { clinicId, firstName, lastName, email, countryCode, phone, role, gender, dateOfBirth, password, speciality } = doctorData


    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!validator.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'Last name is required', field: 'lastName' }

    if(!validator.isNameValid(lastName)) return { isAccepted: false, message: 'Invalid name formate', field: 'lastName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    /*if(!countryCode) return { isAccepted: false, message: 'Country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'Invalid country code', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }
    
    if(typeof phone != 'number') return { isAccepted: false, message: 'Phone formate is invalid', field: 'phone' }
    */
    if(!role) return { isAccepted: false, message: 'Role is required', field: 'role' }

    if(!['DOCTOR', 'STAFF'].includes(role)) return { isAccepted: false, message: 'role format is invalid', field: 'role' }

    if(role == 'STAFF') {

        if(!clinicId) return { isAccepted: false, message: 'Clinic Id is required', field: 'clinicId' }

        if(!validator.isObjectId(clinicId)) return { isAccepted: false, message: 'Clinic Id is invalid', field: 'clinicId' }

    } 

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }

    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }

    if(!dateOfBirth) return { isAccepted: false, message: 'Date of birth', field: 'dateOfBirth' } 

    if(!validator.isDateValid(dateOfBirth)) return { isAccepted: false, message: 'Date of birth format is invalid', field: 'dateOfBirth' }

    if(role == 'DOCTOR') {
        
        if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

        if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

        if(speciality.length == 0) return { isAccepted: false, message: 'Speciality must be atleast one', field: 'speciality' }
    }

    return { isAccepted: true, message: 'data is valid', data: doctorData }

}

const doctorLogin = (doctorData) => {

    const { email, password } = doctorData

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'Invalid email formate', field: 'email' } 
    
    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: doctorData }

}

const verifyPersonalInfo = (verifyData) => {

    const { firstName, lastName, gender, dateOfBirth } = verifyData


    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!validator.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'Last name is required', field: 'lastName' }

    if(!validator.isNameValid(lastName)) return { isAccepted: false, message: 'Invalid name formate', field: 'lastName' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }

    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }

    if(!dateOfBirth) return { isAccepted: false, message: 'Date of birth', field: 'dateOfBirth' } 

    if(!validator.isDateValid(dateOfBirth)) return { isAccepted: false, message: 'Date of birth format is invalid', field: 'dateOfBirth' }


    return { isAccepted: true, message: 'data is valid', data: verifyData }

}

const verifySpecialityInfo = (verifyData) => {

    const { title, description, speciality } = verifyData

    if(!title) return { isAccepted: false, message: 'Title is required', field: 'title' }

    if(!validator.isNameValid(title)) return { isAccepted: false, message: 'Invalid title format', field: 'title' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Invalid description format', field: 'description' }

    if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

    if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

    if(speciality.length == 0) return { isAccepted: false, message: 'Speciality must be atleast one', field: 'speciality' }

    if(!checkSpeciality(speciality)) return { isAccepted: false, message: 'Invalid speciality format', field: 'speciality'}

    return { isAccepted: true, message: 'data is valid', data: verifyData }

}

const addUserEmailVerificationCode = (userVerificationData) => {

    const { userId, email } = userVerificationData


    if(!userId) return { isAccepted: false, message: 'User Id is required', field: 'userId' }

    if(!validator.isObjectId(userId)) return { isAccepted: false, message: 'User Id format is invalid', field: 'userId' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!validator.isEmailValid(email)) return { isAccepted: false, message: 'Email format is invalid', field: 'email' }

    return { isAccepted: true, message: 'data is valid', data: userVerificationData }

}

module.exports = { 
    doctorSignup, 
    doctorLogin, 
    verifyPersonalInfo, 
    verifySpecialityInfo,
    addUserEmailVerificationCode
} 