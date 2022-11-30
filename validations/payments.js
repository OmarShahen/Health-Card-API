const config = require('../config/config')

const addPayment = (paymentData) => {

    const { type, description, amount, price } = paymentData

    if(!type) return { isAccepted: false, message: 'Payment type is required', field: 'type' }

    if(!config.CLUB_PAYMENT_TYPES.includes(type)) return { isAccepted: false, message: 'Invalid payment type', field: 'type' }

    if(!description) return { isAccepted: false, message: 'Payment description is required', field: 'description' } 

    if(!amount) return { isAccepted: false, message: 'Payment amount is required', field: 'amount' }

    if(typeof amount != 'number' || amount < 0) return { isAccepted: false, message: 'Payment amount is invalid', field: 'amount' }

    if(!price) return { isAccepted: false, message: 'Payment price is required', field: 'price' }

    if(typeof price != 'number' || price < 0) return { isAccepted: false, message: 'Payment price is invalid', field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }
}

const updatePayment = (paymentData) => {

    const { description, amount, price } = paymentData

    if(!description) return { isAccepted: false, message: 'Payment description is required', field: 'description' } 

    if(!amount) return { isAccepted: false, message: 'Payment amount is required', field: 'amount' }

    if(typeof amount != 'number' || amount < 0) return { isAccepted: false, message: 'Payment amount is invalid', field: 'amount' }

    if(!price) return { isAccepted: false, message: 'Payment price is required', field: 'price' }

    if(typeof price != 'number' || price < 0) return { isAccepted: false, message: 'Payment price is invalid', field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }
}

module.exports = { addPayment, updatePayment }