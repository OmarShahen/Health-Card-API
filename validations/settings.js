const utils = require('../utils/utils')

const updateSettings = (settingsData) => {

    const { notificationEmail, paymentCommission, currencyPriceUSD, supportNumber } = settingsData

    if(!notificationEmail) return { isAccepted: false, message: 'Notification email is required', field: 'notificationEmail' }

    if(!utils.isEmailValid(notificationEmail)) return { isAccepted: false, message: 'Notification email format is invalid', field: 'notificationEmail' }

    if(!paymentCommission) return { isAccepted: false, message: 'Payment commission is required', field: 'paymentCommission' }

    if(typeof paymentCommission != 'number') return { isAccepted: false, message: 'Payment commission format is invalid', field: 'paymentCommission' }

    if(paymentCommission > 1 || paymentCommission < 0) return { isAccepted: false, message: 'Payment commission must be between 0 and 1', field: 'paymentCommission' }

    if(!currencyPriceUSD) return { isAccepted: false, message: 'Currency Price in USD is required', field: 'currencyPriceUSD' }

    if(typeof currencyPriceUSD != 'number') return { isAccepted: false, message: 'Currency Price in USD format is invalid', field: 'currencyPriceUSD' }

    if(!supportNumber) return { isAccepted: false, message: 'Support number is required', field: 'supportNumber' }

    if(typeof supportNumber != 'string') return { isAccepted: false, message: 'Support number format is invalid', field: 'supportNumber' }


    return { isAccepted: true, message: 'data is valid', data: settingsData }
}

module.exports = { updateSettings }