const utils = require('../utils/utils')
const config = require('../config/config')

const checkServices = (services) => {
    for(let i=0;i<services.length;i++) {
        if(!utils.isObjectId(services[i])) {
            return false
        }
    }

    return true
}


const addInvoice = (invoiceData) => {

    const { clinicId, cardId, status, paymentMethod } = invoiceData

    if(!clinicId) return { isAccepted: false, message: 'Clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Clinic Id format is invalid', field: 'clinicId' }

    if(!cardId) return { isAccepted: false, message: 'Card Id is required', field: 'cardId' }

    if(typeof cardId != 'number') return { isAccepted: false, message: 'Card Id format is invalid', field: 'cardId' }

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.INVOICE_STATUS.includes(status)) return { isAccepted: false, message: 'Invalid status value', field: 'status' }

    if(paymentMethod && !config.PAYMENT_METHOD.includes(paymentMethod)) return { isAccepted: false, message: 'Invalid payment method value', field: 'paymentMethod' }

    return { isAccepted: true, message: 'data is valid', data: invoiceData }

}

const addInvoiceCheckout = (invoiceData) => {

    const { services, paymentMethod, invoiceDate, paidAmount, dueDate } = invoiceData

    if(!services) return { isAccepted: false, message: 'Services is required', field: 'services' }

    if(!Array.isArray(services)) return { isAccepted: false, message: 'Services must be a list', field: 'services' }

    if(services.length == 0) return { isAccepted: false, message: 'Services must be atleast one', field: 'services' }

    if(!checkServices(services)) return { isAccepted: false, message: 'Invalid services format', field: 'services' }

    if(typeof paidAmount != 'number') return { isAccepted: false, message: 'Paid amount format is invalid', field: 'paidAmount' }

    if(!invoiceDate) return { isAccepted: false, message: 'Invoice date is required', field: 'invoiceDate' }

    if(!utils.isDateTimeValid(invoiceDate)) return { isAccepted: false, message: 'Invalid invoice date format', field: 'invoiceDate' }

    if(!paymentMethod) return { isAccepted: false, message: 'Payment method is required', field: 'paymentMethod' }

    if(!config.PAYMENT_METHOD.includes(paymentMethod)) return { isAccepted: false, message: 'Invalid payment method value', field: 'paymentMethod' }

    if(dueDate && !utils.isDateValid(dueDate)) return { isAccepted: false, message: 'Invalid due date format', field: 'dueDate' }

    if(dueDate && dueDate < invoiceDate) return { isAccepted: false, message: 'Due date must be after invoice date', field: 'dueDate' }

    return { isAccepted: true, message: 'data is valid', data: invoiceData }

}

const updateInvoiceStatus = (invoiceData) => {

    const { status } = invoiceData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.INVOICE_STATUS.includes(status)) return { isAccepted: false, message: 'Invalid status value', field: 'status' }

    return { isAccepted: true, message: 'data is valid', data: invoiceData }

}

const updateInvoicePaid = (invoiceData) => {

    const { paid } = invoiceData

    if(!paid) return { isAccepted: false, message: 'Paid is required', field: 'paid' }

    if(typeof paid != 'number') return { isAccepted: false, message: 'Invalid paid value', field: 'paid' }

    return { isAccepted: true, message: 'data is valid', data: invoiceData }

}

const updateInvoice = (invoiceData) => {

    const { paymentMethod, invoiceDate, paidAmount } = invoiceData

    if(typeof paidAmount != 'number') return { isAccepted: false, message: 'Paid amount format is invalid', field: 'paidAmount' }

    if(!invoiceDate) return { isAccepted: false, message: 'Invoice date is required', field: 'invoiceDate' }

    if(!utils.isDateTimeValid(invoiceDate)) return { isAccepted: false, message: 'Invalid invoice date format', field: 'invoiceDate' }

    if(!paymentMethod) return { isAccepted: false, message: 'Payment method is required', field: 'paymentMethod' }

    if(!config.PAYMENT_METHOD.includes(paymentMethod)) return { isAccepted: false, message: 'Invalid payment method value', field: 'paymentMethod' }

    return { isAccepted: true, message: 'data is valid', data: invoiceData }

}

module.exports = { 
    addInvoice, 
    addInvoiceCheckout, 
    updateInvoiceStatus, 
    updateInvoicePaid, 
    updateInvoice 
}