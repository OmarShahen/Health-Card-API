const validator = require('../utils/utils')


const memberData = (memberData) => {

    const { clubId, name, email, phone, countryCode, canAuthenticate, QRCodeURL, QRCodeUUID, languageCode } = memberData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

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

    if(typeof canAuthenticate != 'boolean') return { isAccepted: false, message: 'invalid can authenticate input', field: 'canAuthenticate' }

    if(canAuthenticate == true ) {
        if(!QRCodeURL) return { isAccepted: false, message: 'QR code URL is required', field: 'QRCodeURL' }
        
        if(!QRCodeUUID) return { isAccepted: false, message: 'QR code UUID is required', field: 'QRCodeUUID' }

        if(!validator.isUUIDValid(QRCodeUUID)) return { isAccepted: false, message: 'invalid QR code UUID formate', field: 'QRCodeUUID' }

        if(!languageCode) return { isAccepted: false, message: 'languageCode is required', field: 'languageCode' }
        
        if(!validator.isWhatsappLanguageValid(languageCode)) return { isAccepted: false, message: 'language code is not registered', field: 'languageCode' }
    }

    return { isAccepted: true, message: 'data is valid', data: memberData }

}

const updateMemberData = (memberData) => {

    const { name, email, phone, countryCode, canAuthenticate, QRCodeURL } = memberData


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

    if(typeof canAuthenticate != 'boolean') return { isAccepted: false, message: 'invalid can authenticate input', field: 'canAuthenticate' }

    if(canAuthenticate == true ) {
        if(!QRCodeURL) return { isAccepted: false, message: 'QR code URL is required', field: 'QRCodeURL' }            
    }

    return { isAccepted: true, message: 'data is valid', data: memberData }

}

const updateMemberQRcodeVerificationData = (memberData) => {

    const { QRCodeURL, QRCodeUUID } = memberData

    if(!QRCodeURL) return { isAccepted: false, message: 'QR code URL is required', field: 'QRCodeURL' }
        
    if(!QRCodeUUID) return { isAccepted: false, message: 'QR code UUID is required', field: 'QRCodeUUID' }

    if(!validator.isUUIDValid(QRCodeUUID)) return { isAccepted: false, message: 'invalid QR code UUID formate', field: 'QRCodeUUID' }

    return { isAccepted: true, message: 'data is valid', data: memberData }

}

module.exports = { memberData, updateMemberData, updateMemberQRcodeVerificationData } 