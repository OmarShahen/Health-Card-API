const config = require('../config/config')
const utils = require('../utils/utils')

const checkSpeciality = (specialities) => {
    for(let i=0;i<specialities.length;i++) {
        if(!utils.isObjectId(specialities[i])) {
            return false
        }
    }

    return true
}

const checkPricing = (pricingList) => {
    for(let i=0;i<pricingList.length;i++) {
        const price = pricingList[i]

        if(!price.duration) return false

        if(typeof price.duration != 'number') return false

        if(!price.price) return false

        if(typeof price.price != 'number') return false

    }

    return true
}

const updateUser = (userData) => {

    const { firstName, title, description, phone, gender, dateOfBirth, speciality, subSpeciality, pricing } = userData


    if(firstName && !utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(phone && typeof phone != 'number') return { isAccepted: false, message: 'Invalid phone format', field: 'phone' }

    if(title && typeof title != 'string') return { isAccepted: false, message: 'Invalid title format', field: 'title' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Invalid description format', field: 'description' }

    if(gender && !config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }

    if(dateOfBirth && !utils.isDateValid(dateOfBirth)) return { isAccepted: false, message: 'Date of birth format is invalid', field: 'dateOfBirth' }

    if(speciality) {

        if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

        if(speciality.length == 0) return { isAccepted: false, message: 'Speciality must be atleast one', field: 'speciality' }

        if(!checkSpeciality(speciality)) return { isAccepted: false, message: 'Speciality Ids is invalid', field: 'speciality' }
    }

    if(subSpeciality) {

        if(!Array.isArray(subSpeciality)) return { isAccepted: false, message: 'Subspeciality must be a list', field: 'subSpeciality' }    

        if(subSpeciality.length == 0) return { isAccepted: false, message: 'Subspeciality must be atleast one', field: 'subSpeciality' }

        if(!checkSpeciality(subSpeciality)) return { isAccepted: false, message: 'Subspeciality Ids is invalid', field: 'subSpeciality' }
    }

    if(pricing) {

        if(!Array.isArray(pricing)) return { isAccepted: false, message: 'Pricing must be a list', field: 'pricing' }    

        if(pricing.length != 2) return { isAccepted: false, message: 'Pricing must be atleast two', field: 'pricing' }

        if(!checkPricing(pricing)) return { isAccepted: false, message: 'Pricing format is invalid', field: 'pricing' }

    }


    return { isAccepted: true, message: 'data is valid', data: userData }

}

const updateUserProfileImage = (userData) => {

    const { profileImageURL } = userData

    if(!profileImageURL) return { isAccepted: false, message: 'Image URL is required', field: 'profileImageURL' }

    if(!utils.isValidURL(profileImageURL)) return { isAccepted: false, message: 'Image URL format is invalid', field: 'profileImageURL' }


    return { isAccepted: true, message: 'data is valid', data: userData }

}

const addDoctorUser = (userData) => {

    const { firstName, title, description, email, countryCode, phone, password, gender, dateOfBirth, speciality, subSpeciality } = userData


    if(!firstName) return { isAccepted: false, message: 'Name is required', field: 'firstName' }

    if(typeof firstName != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'firstName' }

    if(!title) return { isAccepted: false, message: 'Title is required', field: 'title' }

    if(!config.DOCTORS_TITLES.includes(title)) return { isAccepted: false, message: 'Title value is not registered', field: 'title' }

    if(!description) return { isAccepted: false, message: 'Description is required', field: 'description' }

    if(typeof description != 'string') return { isAccepted: false, message: 'Description format is invalid', field: 'description' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(!countryCode) return { isAccepted: false, message: 'Country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'Country code format is invalid', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'Phone format is invalid', field: 'phone' }

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    if(typeof password != 'string') return { isAccepted: false, message: 'Password format is invalid', field: 'password' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }
    
    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }

    if(!dateOfBirth) return { isAccepted: false, message: 'Date of birth is required', field: 'dateOfBirth' } 

    if(!utils.isDateValid(dateOfBirth)) return { isAccepted: false, message: 'Date of birth format is invalid', field: 'dateOfBirth' }

    if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

    if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

    if(speciality.length == 0) return { isAccepted: false, message: 'Speciality must be atleast one', field: 'speciality' }

    if(!checkSpeciality(speciality)) return { isAccepted: false, message: 'Speciality Ids is invalid', field: 'speciality' }

    if(!subSpeciality) return { isAccepted: false, message: 'subSpeciality is required', field: 'subSpeciality' }

    if(!Array.isArray(subSpeciality)) return { isAccepted: false, message: 'subSpeciality must be a list', field: 'subSpeciality' }    

    if(subSpeciality.length == 0) return { isAccepted: false, message: 'subSpeciality must be atleast one', field: 'subSpeciality' }

    if(!checkSpeciality(subSpeciality)) return { isAccepted: false, message: 'subSpeciality Ids is invalid', field: 'subSpeciality' }


    return { isAccepted: true, message: 'data is valid', data: userData }

}

const updateUserSpeciality = (userData) => {

    const { speciality } = userData

    if(!speciality) return { isAccepted: false, message: 'Speciality is required', field: 'speciality' }

    if(!Array.isArray(speciality)) return { isAccepted: false, message: 'Speciality must be a list', field: 'speciality' }    

    if(speciality.length == 0) return { isAccepted: false, message: 'Speciality must be atleast one', field: 'speciality' }

    if(!checkSpeciality(speciality)) return { isAccepted: false, message: 'Invalid speciality format', field: 'speciality'}

    return { isAccepted: true, message: 'data is valid', data: userData }

}

const updateUserEmail = (userData) => {

    const { email } = userData

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'invalid email formate', field: 'email' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserLanguage = (userData) => {

    const { lang } = userData

    if(!lang) return { isAccepted: false, message: 'language is required', field: 'lang' }

    if(!config.LANGUAGES.includes(lang)) return { isAccepted: false, message: 'invalid lang format', field: 'lang' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const updateUserPassword = (userData) => {

    const { password } = userData

    if(!password) return { isAccepted: false, message: 'password is required', field: 'password' }

    if(typeof password != 'string') return { isAccepted: false, message: 'invalid password formate', field: 'password' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const verifyAndUpdateUserPassword = (userData) => {

    const { newPassword, currentPassword } = userData

    if(!newPassword) return { isAccepted: false, message: 'new password is required', field: 'newPassword' }

    if(typeof newPassword != 'string') return { isAccepted: false, message: 'invalid new password format', field: 'newPassword' }

    if(!currentPassword) return { isAccepted: false, message: 'current password is required', field: 'currentPassword' }

    if(typeof currentPassword != 'string') return { isAccepted: false, message: 'invalid current password format', field: 'currentPassword' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

const registerStaffToClinic = (clinicData) => {

    const { clinicId } = clinicData

    if(!clinicId) return { isAccepted: false, message: 'clinic Id is required', field: 'clinicId' }

    if(typeof clinicId != 'number') return { isAccepted: false, message: 'clinic Id format is invalid', field: 'clinicId' }


    return { isAccepted: true, message: 'data is valid', data: clinicData }
}

const addEmployeeUser = (userData) => {

    const { firstName, lastName, email, password, countryCode, phone, gender } = userData

    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'Last name is required', field: 'lastName' }

    if(!utils.isNameValid(lastName)) return { isAccepted: false, message: 'Invalid name formate', field: 'lastName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(!countryCode) return { isAccepted: false, message: 'Country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'Country code format is invalid', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'Phone format is invalid', field: 'phone' }

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }

    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }


    return { isAccepted: true, message: 'data is valid', data: userData }
} 


module.exports = { 
    updateUser, 
    updateUserProfileImage,
    updateUserEmail, 
    updateUserPassword,
    updateUserLanguage,
    verifyAndUpdateUserPassword,
    updateUserSpeciality,
    registerStaffToClinic,
    addEmployeeUser,
    addDoctorUser
}