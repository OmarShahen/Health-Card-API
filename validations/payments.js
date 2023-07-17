const utils = require('../utils/utils')
const config = require('../config/config')


const createPaymentURL = (paymentData) => {

    const { firstName, lastName, clinicId, email, phone, planName, planDaysDuration, planPrice } = paymentData

    if(!firstName) return { isAccepted: false, message: 'first name is required', field: 'firstName' }

    if(typeof firstName != 'string') return { isAccepted: false, message: 'first name format is invalid', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'last name is required', field: 'lastName' }

    if(typeof lastName != 'string') return { isAccepted: false, message: 'last name format is invalid', field: 'lastName' }

    if(!clinicId) return { isAccepted: false, message: 'clinic ID is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'clinic ID format is invalid', field: 'clinicId' }

    if(!email) return { isAccepted: false, message: 'email is required', field: 'email' }

    if(!utils.isEmailValid(email)) return { isAccepted: false, message: 'email format is invalid', field: 'email' }

    if(!phone) return { isAccepted: false, message: 'phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'phone format is invalid', field: 'phone' }

    if(!planName) return { isAccepted: false, message: 'plan name is required', field: 'planName' }

    if(typeof planName != 'string') return { isAccepted: false, message: 'plan name format is invalid', field: 'planName' }

    if(!planDaysDuration) return { isAccepted: false, message: 'plan duration in days is required', field: 'planDaysDuration' }

    if(typeof planDaysDuration != 'number') return { isAccepted: false, message: 'plan duration format is invalid', field: 'planDaysDuration' }

    if(!planPrice) return { isAccepted: false, message: 'plan price is required', field: 'planPrice' }

    if(typeof planPrice != 'number') return { isAccepted: false, message: 'plan price format is invalid', field: 'planPrice' }


    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

module.exports = { createPaymentURL }