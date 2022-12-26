const utils = require('../utils/utils')
const translations = require('../i18n/index')


const receiveItem = (paymentData, lang) => {

    const { itemId, supplierId, staffId, amount, price } = paymentData

    if(!itemId) return { isAccepted: false, message: 'Item Id is required', field: 'itemId' }

    if(!utils.isObjectId(itemId)) return { isAccepted: false, message: 'Invalid item Id formate', field: 'itemId' }

    if(!supplierId) return { isAccepted: false, message: 'Supplier Id is required', field: 'supplierId' }

    if(!utils.isObjectId(supplierId)) return { isAccepted: false, message: 'Invalid supplier Id formate', field: 'supplierId' }

    if(!staffId) return { isAccepted: false, message: 'Staff Id is required', field: 'staffId' }

    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id formate', field: 'staffId' }

    if(!amount) return { isAccepted: false, message: translations[lang]['Item amount is required'], field: 'amount' }

    if(typeof amount != 'number') return { isAccepted: false, message: translations[lang]['Item amount must be a number'], field: 'amount' }

    if(!price) return { isAccepted: false, message: translations[lang]['Item price is required'], field: 'price' }

    if(typeof price != 'number') return { isAccepted: false, message: translations[lang]['Item price must be a number'], field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

const deductItem = (paymentData, lang) => {

    const { itemId, staffId, amount, price } = paymentData

    if(!itemId) return { isAccepted: false, message: 'Item Id is required', field: 'itemId' }

    if(!utils.isObjectId(itemId)) return { isAccepted: false, message: 'Invalid item Id formate', field: 'itemId' }

    if(!staffId) return { isAccepted: false, message: 'Staff Id is required', field: 'staffId' }

    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id formate', field: 'staffId' }

    if(!amount) return { isAccepted: false, message: translations[lang]['Item amount is required'], field: 'amount' }

    if(typeof amount != 'number') return { isAccepted: false, message: translations[lang]['Item amount must be a number'], field: 'amount' }

    if(!price) return { isAccepted: false, message: translations[lang]['Item price is required'], field: 'price' }

    if(typeof price != 'number') return { isAccepted: false, message: translations[lang]['Item price must be a number'], field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

module.exports = { receiveItem, deductItem }