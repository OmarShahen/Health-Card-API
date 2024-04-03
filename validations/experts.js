const utils = require('../utils/utils')
const config = require('../config/config')


const checkSpeciality = (specialities) => {
    for(let i=0;i<specialities.length;i++) {
        if(!utils.isObjectId(specialities[i])) {
            return false
        }
    }

    return true
}


const addExpert = (expertData) => {

    const { firstName, email, countryCode, phone, password, gender } = expertData

    if(!firstName) return { isAccepted: false, message: 'Name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name format', field: 'firstName' }

    if(!email) return { isAccepted: false, message: 'Email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(!countryCode) return { isAccepted: false, message: 'Country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'Country code format is invalid', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'Phone format is invalid', field: 'phone' }

    if(!password) return { isAccepted: false, message: 'Password is required', field: 'password' }

    const validatedPassword = utils.isPasswordStrong(password)

    if(!validatedPassword.isAccepted) return { isAccepted: false, message: validatedPassword.message, field: 'password' }

    if(!gender) return { isAccepted: false, message: 'Gender is required', field: 'gender' }

    if(!config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }


    return { isAccepted: true, message: 'data is valid', data: expertData }
}

const updateExpert = (userData) => {

    const { title, description, sessionPrice, speciality, subSpeciality, languages, meetingLink } = userData

    if(title && typeof title != 'string') return { isAccepted: false, message: 'Invalid title format', field: 'title' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Invalid description format', field: 'description' }

    if(sessionPrice && typeof sessionPrice != 'number') return { isAccepted: false, message: 'Invalid session price format', field: 'sessionPrice' }

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

    if(languages) {

        if(!Array.isArray(languages)) return { isAccepted: false, message: 'Languages must be a list', field: 'languages' }    

        if(languages.length == 0) return { isAccepted: false, message: 'Languages must be atleast one', field: 'languages' }

    }

    if(meetingLink && !utils.isValidURL(meetingLink)) return { isAccepted: false, message: 'Invalid meeting link format', field: 'meetingLink' }

    return { isAccepted: true, message: 'data is valid', data: userData }

}

const addBankInfo = (expertData) => {

    const { accountNumber, accountHolderName, bankName } = expertData

    if(!accountNumber) return { isAccepted: false, message: 'Account number is required', field: 'accountNumber' }

    if(typeof accountNumber != 'number') return { isAccepted: false, message: 'Account number format is invalid', field: 'accountNumber' }

    if(!accountHolderName) return { isAccepted: false, message: 'Account holder name is required', field: 'accountHolderName' }

    if(typeof accountHolderName != 'string') return { isAccepted: false, message: 'Invalid account holder name format', field: 'accountHolderName' }

    if(!bankName) return { isAccepted: false, message: 'Bank name is required', field: 'bankName' }

    if(typeof bankName != 'string') return { isAccepted: false, message: 'Invalid bank name format', field: 'bankName' }

    return { isAccepted: true, message: 'data is valid', data: expertData }
}

const addMobileWalletInfo = (expertData) => {

    const { walletNumber } = expertData

    if(!walletNumber) return { isAccepted: false, message: 'Wallet number is required', field: 'walletNumber' }

    if(typeof walletNumber != 'string') return { isAccepted: false, message: 'Wallet number format is invalid', field: 'walletNumber' }

    if(!utils.isPhoneValid(walletNumber)) return { isAccepted: false, message: 'Wallet phone number format is invalid', field: 'walletNumber' } 

    return { isAccepted: true, message: 'data is valid', data: expertData }
}

const updateExpertOnBoarding = (expertData) => {

    const { isOnBoarded } = expertData

    if(typeof isOnBoarded != 'boolean') return { isAccepted: false, message: 'OnBoarded format is invalid', field: 'isOnBoarded' }

    return { isAccepted: true, message: 'data is valid', data: expertData }
}

const updateExpertPromoCodesAcceptance = (expertData) => {

    const { isAcceptPromoCodes } = expertData

    if(typeof isAcceptPromoCodes != 'boolean') return { isAccepted: false, message: 'isAcceptPromoCodes format is invalid', field: 'isAcceptPromoCodes' }

    return { isAccepted: true, message: 'data is valid', data: expertData }
}

const updateExpertOnline = (userData) => {

    const { isOnline } = userData

    if(typeof isOnline != 'boolean') return { isAccepted: false, message: 'Invalid isOnline format', field: 'isOnline' }

    return { isAccepted: true, message: 'data is valid', data: userData }
}

module.exports = { 
    addExpert, 
    updateExpert,
    addBankInfo, 
    addMobileWalletInfo, 
    updateExpertOnBoarding, 
    updateExpertPromoCodesAcceptance,
    updateExpertOnline
}