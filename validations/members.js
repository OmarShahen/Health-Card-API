const validator = require('../utils/utils')
const translations = require('../i18n/index')


const memberData = (memberData, lang) => {

    const { 
        clubId, 
        staffId, 
        name, 
        email, 
        phone, 
        countryCode,
        membership, 
        gender,
        age 
    } = memberData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!staffId) return { isAccepted: false, message: 'staff Id is required', field: 'staffId' }

    if(!validator.isObjectId(staffId)) return { isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' }

    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: translations[lang]['Invalid name formate'], field: 'name' }

    if(name.split(' ').length != 2) return { isAccepted: false, message: translations[lang]['Name must be two words'], field: 'name' }

    if(email) {
        if(!validator.isEmailValid(email)) return { isAccepted: false, message: translations[lang]['Email formate is invalid'], field: 'email' }
    }

    if(!phone) return { isAccepted: false, message: translations[lang]['Phone is required'], field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: translations[lang]['Phone formate is invalid'], field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: translations[lang]['Country code is required'], field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: translations[lang]['Invalid country code'], field: 'countryCode' }

    if(membership && typeof membership != 'number') {
        return { isAccepted: false, message: translations[lang]['Membership must be a number'], field: 'membership' }
    }   

    if(!['male', 'female'].includes(gender)) return { isAccepted: false, message: translations[lang]['Invalid gender'], field: 'gender' }

    if(age && !Number.parseInt(age)) return { isAccepted: false, message: translations[lang]['Invalid age'], field: 'age' }
    

    return { isAccepted: true, message: 'data is valid', data: memberData }

}

const offlineAddMemberData = (memberData) => {

    const { 
        id,
        clubId, 
        staffId, 
        name, 
        email, 
        phone, 
        countryCode, 
        gender,
        age,
        canAuthenticate, 
        QRCodeURL, 
        QRCodeUUID, 
    } = memberData

    let errors = []
    let isAccepted = true

    if(!id) {
        isAccepted = false
        errors.push({ message: 'Id is required', field: 'Id' })
    }

    if(!Number.isInteger(id)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'Id must be a integer', field: 'Id' })
    }

    if(!clubId) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'club Id is required', field: 'clubId' })
    }

    if(!validator.isObjectId(clubId)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid club Id formate', field: 'clubId' })
    }

    if(!staffId) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'staff Id is required', field: 'staffId' })
    }

    if(!validator.isObjectId(staffId)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' })
    }

    if(!name) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'name is required', field: 'name' })
    }

    if(!validator.isNameValid(name)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid name formate', field: 'name' })
    }

    if(name.split(' ').length != 2) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'name must be 2 words', field: 'name' })
    }

    if(email) {
        if(!validator.isEmailValid(email)) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'email formate is invalid', field: 'email' })
        }
    }

    if(!phone) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'phone is required', field: 'phone' })
    }

    if(!validator.isPhoneValid(phone)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'phone formate is invalid', field: 'phone' })
    }

    if(!countryCode) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'country code is required', field: 'countryCode' })
    }

    if(!validator.isCountryCodeValid(countryCode)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid country Code', field: 'countryCode' })
    }

    if(!['male', 'female'].includes(gender)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid gender', field: 'gender' })
    }

    if(age && !Number.parseInt(age)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid age', field: 'age' })
    }

    if(typeof canAuthenticate != 'boolean') {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid can authenticate input', field: 'canAuthenticate' })
    }

    if(canAuthenticate == true ) {
        if(!QRCodeURL) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'QR code URL is required', field: 'QRCodeURL' })
        }
        
        if(!QRCodeUUID) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'QR code UUID is required', field: 'QRCodeUUID' })
        }

        if(!validator.isUUIDValid(QRCodeUUID)) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'invalid QR code UUID formate', field: 'QRCodeUUID' })
        }
        
    }

    return { isAccepted, errors }

}

const offlineUpdateMemberData = (memberData) => {

    const { 
        _id,
        clubId, 
        staffId,
        name, 
        email, 
        phone, 
        countryCode, 
        gender,
        birthYear,
        canAuthenticate, 
        QRCodeURL, 
        QRCodeUUID, 
    } = memberData

    let errors = []
    let isAccepted = true

    if(!_id) {
        isAccepted = false
        errors.push({ message: 'member Id is required', field: '_id' })
    }

    if(!validator.isObjectId(_id)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid member Id formate', field: '_id' })
    }

    if(!clubId) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'club Id is required', field: 'clubId' })
    }

    if(!validator.isObjectId(clubId)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid club Id formate', field: 'clubId' })
    }

    if(!staffId) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'staff Id is required', field: 'staffId' })
    }

    if(!validator.isObjectId(staffId)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' })
    }

    if(!name) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'name is required', field: 'name' })
    }

    if(!validator.isNameValid(name)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid name formate', field: 'name' })
    }

    if(name.split(' ').length != 2) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'name must be 2 words', field: 'name' })
    }

    if(email) {
        if(!validator.isEmailValid(email)) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'email formate is invalid', field: 'email' })
        }
    }

    if(!phone) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'phone is required', field: 'phone' })
    }

    if(!validator.isPhoneValid(phone)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'phone formate is invalid', field: 'phone' })
    }

    if(!countryCode) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'country code is required', field: 'countryCode' })
    }

    if(!validator.isCountryCodeValid(countryCode)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid country Code', field: 'countryCode' })
    }

    if(!['male', 'female'].includes(gender)) {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid gender', field: 'gender' })
    }

    if(birthYear && typeof birthYear != 'string') {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid birth year', field: 'birthYear' })
    }

    if(typeof canAuthenticate != 'boolean') {
        isAccepted = false
        errors.push({ isAccepted: false, message: 'invalid can authenticate input', field: 'canAuthenticate' })
    }

    if(canAuthenticate == true ) {
        if(!QRCodeURL) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'QR code URL is required', field: 'QRCodeURL' })
        }
        
        if(!QRCodeUUID) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'QR code UUID is required', field: 'QRCodeUUID' })
        }

        if(!validator.isUUIDValid(QRCodeUUID)) {
            isAccepted = false
            errors.push({ isAccepted: false, message: 'invalid QR code UUID formate', field: 'QRCodeUUID' })
        }
        
    }

    return { isAccepted, errors }

}

const memberDataCheck = (memberData, lang) => {

    const { clubId, staffId, name, email, phone, countryCode } = memberData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!staffId) return { isAccepted: false, message: 'staff Id is required', field: 'staffId' }

    if(!validator.isObjectId(staffId)) return { isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' }

    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: translations[lang]['Invalid name formate'], field: 'name' }

    if(name.split(' ').length != 2) return { isAccepted: false, message: translations[lang]['Name must be 2 words'], field: 'name' }

    if(email) {
        if(!validator.isEmailValid(email)) return { isAccepted: false, message: translations[lang]['Email formate is invalid'], field: 'email' }
    }

    if(!phone) return { isAccepted: false, message: translations[lang]['Phone is required'], field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: translations[lang]['Phone formate is invalid'], field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: translations[lang]['Country code is required'], field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: translations[lang]['Invalid country Code'], field: 'countryCode' }


    return { isAccepted: true, message: 'data is valid', data: memberData }

}

const updateMemberData = (memberData, lang) => {

    const { name, email, phone, countryCode, membership, gender, age } = memberData


    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: translations[lang]['Invalid name formate'], field: 'name' }

    if(name.split(' ').length != 2) return { isAccepted: false, message: translations[lang]['Name must be 2 words'], field: 'name' }

    if(email) {
        if(!validator.isEmailValid(email)) return { isAccepted: false, message: translations[lang]['Email formate is invalid'], field: 'email' }
    }

    if(!phone) return { isAccepted: false, message: translations[lang]['Phone is required'], field: 'phone' }

    if(!validator.isPhoneValid(phone)) return { isAccepted: false, message: translations[lang]['Phone formate is invalid'], field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: translations[lang]['Country code is required'], field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: translations[lang]['Invalid country Code'], field: 'countryCode' }
    
    if(!membership) return { isAccepted: false, message: translations[lang]['Membership is required'], field: 'membership' }

    if(gender && !['male', 'female'].includes(gender)) return { isAccepted: false, message: translations[lang]['Invalid gender'], field: 'gender' }

    if(age && !Number.parseInt(age)) return { isAccepted: false, message: translations[lang]['Invalid age'], field: 'age' }

    if(typeof membership != 'number') return { isAccepted: false, message: translations[lang]['Membership must be a number'], field: 'membership' }

    return { isAccepted: true, message: 'data is valid', data: memberData }

}

const updateMemberQRcodeVerificationData = (memberData) => {

    const { QRCodeURL, QRCodeUUID } = memberData

    if(!QRCodeURL) return { isAccepted: false, message: 'QR code URL is required', field: 'QRCodeURL' }
        
    if(!QRCodeUUID) return { isAccepted: false, message: 'QR code UUID is required', field: 'QRCodeUUID' }

    if(!validator.isUUIDValid(QRCodeUUID)) return { isAccepted: false, message: 'invalid QR code UUID formate', field: 'QRCodeUUID' }

    return { isAccepted: true, message: 'data is valid', data: memberData }

}

const updateMemberAuthenticationStatusData = (memberData) => {

    const { canAuthenticate, QRCodeURL, QRCodeUUID, languageCode } = memberData

    if(typeof canAuthenticate != 'boolean') return { isAccepted: false, message: 'invalid authentication status formate', field: 'canAuthenticate' } 

    if(canAuthenticate) {

        if(!QRCodeURL) return { isAccepted: false, message: 'QR code URL is required', field: 'QRCodeURL' }
        
        if(!QRCodeUUID) return { isAccepted: false, message: 'QR code UUID is required', field: 'QRCodeUUID' }

        if(!validator.isUUIDValid(QRCodeUUID)) return { isAccepted: false, message: 'invalid QR code UUID formate', field: 'QRCodeUUID' }

        if(!languageCode) return { isAccepted: false, message: 'language code is required', field: 'languageCode' }

        if(!validator.isWhatsappLanguageValid(languageCode)) return { isAccepted: false, message: 'invalid language code', field: 'languageCode' }
    }

    return { isAccepted: true, message: 'data is valid', data: memberData }

}

module.exports = { memberData, offlineAddMemberData, offlineUpdateMemberData, memberDataCheck, updateMemberData, updateMemberQRcodeVerificationData, updateMemberAuthenticationStatusData } 