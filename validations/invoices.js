const utils = require('../utils/utils')
const config = require('../config/config')

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

const updateInvoiceStatus = (invoiceData) => {

    const { status } = invoiceData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.INVOICE_STATUS.includes(status)) return { isAccepted: false, message: 'Invalid status value', field: 'status' }

    return { isAccepted: true, message: 'data is valid', data: invoiceData }

}

module.exports = { addInvoice, updateInvoiceStatus }