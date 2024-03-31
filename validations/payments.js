const utils = require('../utils/utils')

const createPaymentURL = (paymentData) => {

    const { appointmentId, planName, planPrice } = paymentData


    if(!appointmentId) return { isAccepted: false, message: 'appointment ID is required', field: 'appointmentId' }

    if(!utils.isObjectId(appointmentId)) return { isAccepted: false, message: 'appointment ID format is invalid', field: 'appointmentId' }

    if(!planName) return { isAccepted: false, message: 'plan name is required', field: 'planName' }

    if(typeof planName != 'string') return { isAccepted: false, message: 'plan name format is invalid', field: 'planName' }

    if(!planPrice) return { isAccepted: false, message: 'plan price is required', field: 'planPrice' }

    if(typeof planPrice != 'number') return { isAccepted: false, message: 'plan price format is invalid', field: 'planPrice' }


    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

const createMobileWalletPaymentURL = (paymentData) => {

    const { walletPhone, appointmentId, planName, planPrice } = paymentData

    if(!walletPhone) return { isAccepted: false, message: 'Wallet phone is required', field: 'walletPhone' }

    if(typeof walletPhone != 'string') return { isAccepted: false, message: 'Wallet phone format is invalid', field: 'walletPhone' }

    if(!appointmentId) return { isAccepted: false, message: 'appointment ID is required', field: 'appointmentId' }

    if(!utils.isObjectId(appointmentId)) return { isAccepted: false, message: 'appointment ID format is invalid', field: 'appointmentId' }

    if(!planName) return { isAccepted: false, message: 'plan name is required', field: 'planName' }

    if(typeof planName != 'string') return { isAccepted: false, message: 'plan name format is invalid', field: 'planName' }

    if(!planPrice) return { isAccepted: false, message: 'plan price is required', field: 'planPrice' }

    if(typeof planPrice != 'number') return { isAccepted: false, message: 'plan price format is invalid', field: 'planPrice' }


    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

const updatePaymentExpertPaid = (paymentData) => {

    const { isExpertPaid } = paymentData

    if(typeof isExpertPaid != 'boolean') return { isAccepted: false, message: 'isExpertPaid format is invalid', field: 'isExpertPaid' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

module.exports = { createPaymentURL, createMobileWalletPaymentURL, updatePaymentExpertPaid }