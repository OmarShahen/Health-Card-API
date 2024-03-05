const utils = require('../utils/utils')


const addPromoCode = (promoCodeData) => {

    const { code, percentage, maxUsage, userMaxUsage, expirationDate } = promoCodeData

    if(!code) return { isAccepted: false, message: 'Code is required', field: 'code' }

    if(typeof code != 'string') return { isAccepted: false, message: 'Invalid code format', field: 'code' }

    if(typeof percentage != 'number') return { isAccepted: false, message: 'Percentage format is invalid', field: 'percentage' }

    if(percentage > 1) return { isAccepted: false, message: 'Percentage is higher than 1', field: 'percentage' } 

    if(typeof maxUsage != 'number') return { isAccepted: false, message: 'Max usage format is invalid', field: 'maxUsage' }

    if(typeof userMaxUsage != 'number') return { isAccepted: false, message: 'User max usage format is invalid', field: 'userMaxUsage' }

    if(expirationDate && !utils.isDateValid(expirationDate)) return { isAccepted: false, message: 'Expiration date format is invalid', field: 'expirationDate' }


    return { isAccepted: true, message: 'data is valid', data: promoCodeData }
}

const updatePromoCode = (promoCodeData) => {

    const { code, percentage, maxUsage, userMaxUsage, expirationDate } = promoCodeData

    if(!code) return { isAccepted: false, message: 'Code is required', field: 'code' }

    if(typeof code != 'string') return { isAccepted: false, message: 'Invalid code format', field: 'code' }

    if(typeof percentage != 'number') return { isAccepted: false, message: 'Percentage format is invalid', field: 'percentage' }

    if(percentage > 1) return { isAccepted: false, message: 'Percentage is higher than 1', field: 'percentage' } 

    if(typeof maxUsage != 'number') return { isAccepted: false, message: 'Max usage format is invalid', field: 'maxUsage' }

    if(typeof userMaxUsage != 'number') return { isAccepted: false, message: 'User max usage format is invalid', field: 'userMaxUsage' }

    if(expirationDate && !utils.isDateValid(expirationDate)) return { isAccepted: false, message: 'Expiration date format is invalid', field: 'expirationDate' }


    return { isAccepted: true, message: 'data is valid', data: promoCodeData }
}

const updatePromoCodeActivity = (promoCodeData) => {

    const { isActive } = promoCodeData

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    return { isAccepted: true, message: 'data is valid', data: promoCodeData }
}


module.exports = { addPromoCode, updatePromoCodeActivity, updatePromoCode }