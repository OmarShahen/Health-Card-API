const config = require('../config/config')
const utils = require('../utils/utils')

const addPayment = (paymentData) => {

    const { staffId, type, category, description, staffIdPayroll, amount, price } = paymentData


    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id', field: 'staffId' }

    if(!type) return { isAccepted: false, message: 'Payment type is required', field: 'type' }

    if(!config.CLUB_PAYMENT_TYPES.includes(type)) return { isAccepted: false, message: 'Invalid payment type', field: 'type' }
    
    if(!category) return { isAccepted: false, message: 'Payment category is required', field: 'type' }

    if(!config.CLUB_PAYMENT_CATEGORIES.includes(category)) return { isAccepted: false, message: 'Invalid category type', field: 'type' }

    if(category == 'PAYROLL' && !utils.isObjectId(staffIdPayroll)) return { isAccepted: false, message: 'Invalid staff Id for payroll', field: 'staffIdPayroll' }

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