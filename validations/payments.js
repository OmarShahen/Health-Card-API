const config = require('../config/config')
const utils = require('../utils/utils')
const translations = require('../i18n/index')

const addPayment = (paymentData, lang) => {

    const { staffId, type, category, description, amount, price } = paymentData

    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id', field: 'staffId' }

    if(!type) return { isAccepted: false, message: translations[lang]['Payment type is required'], field: 'type' }

    if(!config.CLUB_PAYMENT_TYPES.includes(type)) return { isAccepted: false, message: translations[lang]['Invalid payment type'], field: 'type' }
    
    if(!category) return { isAccepted: false, message: translations[lang]['Payment category is required'], field: 'type' }

    if(!config.CLUB_PAYMENT_CATEGORIES.includes(category)) return { isAccepted: false, message: translations[lang]['Invalid category type'], field: 'type' }

    if(!description) return { isAccepted: false, message: translations[lang]['Payment description is required'], field: 'description' } 

    if(!amount) return { isAccepted: false, message: translations[lang]['Payment amount is required'], field: 'amount' }

    if(typeof amount != 'number' || amount < 0) return { isAccepted: false, message: translations[lang]['Payment amount is invalid'], field: 'amount' }

    if(!price) return { isAccepted: false, message: translations[lang]['Payment price is required'], field: 'price' }

    if(typeof price != 'number' || price < 0) return { isAccepted: false, message: translations[lang]['Payment price is invalid'], field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }
}

const addBillPayment = (paymentData, lang) => {

    const { staffId, description, paid, imageURL } = paymentData

    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id', field: 'staffId' }
    
    if(!description) return { isAccepted: false, message: translations[lang]['Payment description is required'], field: 'description' } 

    if(!paid) return { isAccepted: false, message: translations[lang]['Payment price is required'], field: 'paid' }

    if(typeof paid != 'number' || paid < 0) return { isAccepted: false, message: translations[lang]['Payment price is invalid'], field: 'paid' }

    if(imageURL && typeof imageURL != 'string') return { isAccepted: false, message: 'Bill image is required', field: 'imageURL' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }
}

const addPayrollPayment = (paymentData, lang) => {

    const { staffId, staffIdPayroll, paid } = paymentData


    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id', field: 'staffId' }
    
    if(!utils.isObjectId(staffIdPayroll)) return { isAccepted: false, message: 'Invalid staff Id for payroll', field: 'staffIdPayroll' }

    if(!paid) return { isAccepted: false, message: translations[lang]['Payroll payment is required'], field: 'paid' }

    if(typeof paid != 'number' || paid < 0) return { isAccepted: false, message: 'Payroll payment is invalid', field: 'paid' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }
}
const updatePayment = (paymentData, lang) => {

    const { description, amount, price, category } = paymentData

    if(category != 'PAYROLL' && !description) return { isAccepted: false, message: translations[lang]['Payment description is required'], field: 'description' } 

    if(!amount) return { isAccepted: false, message: translations[lang]['Payment amount is required'], field: 'amount' }

    if(typeof amount != 'number' || amount < 0) return { isAccepted: false, message: translations[lang]['Payment amount is invalid'], field: 'amount' }

    if(!price) return { isAccepted: false, message: translations[lang]['Payment price is required'], field: 'price' }

    if(typeof price != 'number' || price < 0) return { isAccepted: false, message: translations[lang]['Payment price is invalid'], field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }
}

module.exports = { addPayment, updatePayment, addPayrollPayment, addBillPayment }