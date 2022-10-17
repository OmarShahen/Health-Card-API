const config = require('../config/config')
const validator = require('../utils/utils')
const translations = require('../i18n/index')

const packageData = (packageData, lang) => {

    const { clubId, title, attendance, expiresIn, price } = packageData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!title) return { isAccepted: false, message: translations[lang]['Title is required'], field: 'title' }

    if(!attendance) return { isAccepted: false, message: translations[lang]['Attendance is required'], field: 'attendance' }

    if(!Number.isInteger(attendance)) return { isAccepted: false, message: translations[lang]['Attendance must be a number'], field: 'attendance' }

    if(attendance > config.MAX_ATTENDANCE) {
        return { isAccepted: false, message: translations[lang]['Passed the maximum number of attendances'], field: 'attendance' }
    }

    if(attendance <= 0) return { isAccepted: false, message: translations[lang]['Minimum number of attendance is 1'], field: 'attendance' } 

    if(!expiresIn) return { isAccepted: false, message: translations[lang]['Expiration period is required'], field: 'expiresIn' }

    const validateExpirationPeriod = validator.isDatePeriodValid(expiresIn)
    if(!validateExpirationPeriod.isAccepted) {
        validateExpirationPeriod.field = 'expiresIn'
        return validateExpirationPeriod
    }

    if(!price) return { isAccepted: false, message: translations[lang]['Price is required'], field: 'price' }

    if(!Number.isInteger(price)) return { isAccepted: false, message: translations[lang]['Price must be a number'], field: 'price' }

    if(price < 0) return { isAccepted: false, message: translations[lang]['Price must be atleast 0'], field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: packageData }

}

const updatePackageData = (packageData, lang) => {

    const { title, attendance, expiresIn, price } = packageData

    if(!title) return { isAccepted: false, message: translations[lang]['Title is required'], field: 'title' }

    if(!attendance) return { isAccepted: false, message: translations[lang]['Attendance is required'], field: 'attendance' }

    if(!Number.isInteger(attendance)) return { isAccepted: false, message: translations[lang]['Attendance must be a number'], field: 'attendance' }

    if(attendance > config.MAX_ATTENDANCE) {
        return { isAccepted: false, message: translations[lang][`Passed the maximum number of attendances`], field: 'attendance' }
    }

    if(attendance <= 0) return { isAccepted: false, message: translations[lang]['Minimum number of attendance is 1'], field: 'attendance' } 

    if(!expiresIn) return { isAccepted: false, message: translations[lang]['Expiration period is required'], field: 'expiresIn' }

    const validateExpirationPeriod = validator.isDatePeriodValid(expiresIn)
    if(!validateExpirationPeriod.isAccepted) {
        validateExpirationPeriod.field = 'expiresIn'
        return validateExpirationPeriod
    }

    if(!price) return { isAccepted: false, message: translations[lang]['Price is required'], field: 'price' }

    if(!Number.isInteger(price)) return { isAccepted: false, message: translations[lang]['Price must be a number'], field: 'price' }

    if(price < 0) return { isAccepted: false, message: translations[lang]['Price must be at least 0'], field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: packageData }

}

module.exports = { packageData, updatePackageData } 