const utils = require('../utils/utils')

const createPaymentURL = (paymentData) => {

    const { firstName, lastName, appointmentId, email, phone, planName, planPrice } = paymentData

    if(!firstName) return { isAccepted: false, message: 'first name is required', field: 'firstName' }

    if(typeof firstName != 'string') return { isAccepted: false, message: 'first name format is invalid', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'last name is required', field: 'lastName' }

    if(typeof lastName != 'string') return { isAccepted: false, message: 'last name format is invalid', field: 'lastName' }

    if(!appointmentId) return { isAccepted: false, message: 'appointment ID is required', field: 'appointmentId' }

    if(!utils.isObjectId(appointmentId)) return { isAccepted: false, message: 'appointment ID format is invalid', field: 'appointmentId' }

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'email format is invalid', field: 'email' }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'phone format is invalid', field: 'phone' }

    if(!planName) return { isAccepted: false, message: 'plan name is required', field: 'planName' }

    if(typeof planName != 'string') return { isAccepted: false, message: 'plan name format is invalid', field: 'planName' }

    if(!planPrice) return { isAccepted: false, message: 'plan price is required', field: 'planPrice' }

    if(typeof planPrice != 'number') return { isAccepted: false, message: 'plan price format is invalid', field: 'planPrice' }


    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

const createMobileWalletPaymentURL = (paymentData) => {

    const { walletPhone, firstName, lastName, appointmentId, email, phone, planName, planPrice } = paymentData

    if(!walletPhone) return { isAccepted: false, message: 'Wallet phone is required', field: 'walletPhone' }

    if(typeof walletPhone != 'string') return { isAccepted: false, message: 'Wallet phone format is invalid', field: 'walletPhone' }

    if(!firstName) return { isAccepted: false, message: 'first name is required', field: 'firstName' }

    if(typeof firstName != 'string') return { isAccepted: false, message: 'first name format is invalid', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'last name is required', field: 'lastName' }

    if(typeof lastName != 'string') return { isAccepted: false, message: 'last name format is invalid', field: 'lastName' }

    if(!appointmentId) return { isAccepted: false, message: 'appointment ID is required', field: 'appointmentId' }

    if(!utils.isObjectId(appointmentId)) return { isAccepted: false, message: 'appointment ID format is invalid', field: 'appointmentId' }

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'email format is invalid', field: 'email' }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'phone format is invalid', field: 'phone' }

    if(!planName) return { isAccepted: false, message: 'plan name is required', field: 'planName' }

    if(typeof planName != 'string') return { isAccepted: false, message: 'plan name format is invalid', field: 'planName' }

    if(!planPrice) return { isAccepted: false, message: 'plan price is required', field: 'planPrice' }

    if(typeof planPrice != 'number') return { isAccepted: false, message: 'plan price format is invalid', field: 'planPrice' }


    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

module.exports = { createPaymentURL, createMobileWalletPaymentURL }