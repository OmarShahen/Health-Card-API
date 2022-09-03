const config = require('../config/config')
const validator = require('../utils/utils')

const packageData = (packageData) => {

    const { clubId, title, attendance, expiresIn, price } = packageData

    if(!clubId) return { isAccepted: false, message: 'club Id is required', field: 'clubId' }

    if(!validator.isObjectId(clubId)) return { isAccepted: false, message: 'invalid club Id formate', field: 'clubId' }

    if(!title) return { isAccepted: false, message: 'title is required', field: 'title' }

    if(!attendance) return { isAccepted: false, message: 'attendance is required', field: 'attendance' }

    if(!Number.isInteger(attendance)) return { isAccepted: false, message: 'attendance must be a number', field: 'attendance' }

    if(attendance > config.MAX_ATTENDANCE) {
        return { isAccepted: false, message: `maximum number of attendance is ${config.MAX_ATTENDANCE}`, field: 'attendance' }
    }

    if(attendance <= 0) return { isAccepted: false, message: 'minimum number of attendance is 1', field: 'attendance' } 

    if(!expiresIn) return { isAccepted: false, message: 'expiration period is required', field: 'expiresIn' }

    const validateExpirationPeriod = validator.isDatePeriodValid(expiresIn)
    if(!validateExpirationPeriod.isAccepted) {
        validateExpirationPeriod.field = 'expiresIn'
        return validateExpirationPeriod
    }

    if(!price) return { isAccepted: false, message: 'price is required', field: 'price' }

    if(!Number.isInteger(price)) return { isAccepted: false, message: 'price must be a number', field: 'price' }

    if(price < 0) return { isAccepted: false, message: 'price must be at least 0', field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: packageData }

}

const updatePackageData = (packageData) => {

    const { title, attendance, expiresIn, price } = packageData

    if(!title) return { isAccepted: false, message: 'title is required', field: 'title' }

    if(!attendance) return { isAccepted: false, message: 'attendance is required', field: 'attendance' }

    if(!Number.isInteger(attendance)) return { isAccepted: false, message: 'attendance must be a number', field: 'attendance' }

    if(attendance > config.MAX_ATTENDANCE) {
        return { isAccepted: false, message: `maximum number of attendance is ${config.MAX_ATTENDANCE}`, field: 'attendance' }
    }

    if(attendance <= 0) return { isAccepted: false, message: 'minimum number of attendance is 1', field: 'attendance' } 

    if(!expiresIn) return { isAccepted: false, message: 'expiration period is required', field: 'expiresIn' }

    const validateExpirationPeriod = validator.isExpirationPeriodValid(expiresIn)
    if(!validateExpirationPeriod.isAccepted) {
        return validateExpirationPeriod
    }

    if(!price) return { isAccepted: false, message: 'price is required', field: 'price' }

    if(!Number.isInteger(price)) return { isAccepted: false, message: 'price must be a number', field: 'price' }

    if(price < 0) return { isAccepted: false, message: 'price must be at least 0', field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: packageData }

}

module.exports = { packageData, updatePackageData } 