const utils = require('../utils/utils')
const translations = require('../i18n/index')

const itemValidation = (item, lang) => {

    const { itemId, amount, price } = item

    if(!itemId) return { isAccepted: false, message: 'Item Id is required', field: 'itemId' }

    if(!utils.isObjectId(itemId)) return { isAccepted: false, message: 'Item Id formate is invalid', field: 'itemId' }

    if(!amount) return { isAccepted: false, message: 'Amount is required', field: 'amount' }

    if(typeof amount != 'number') return { isAccepted: false, message: 'Amount must be a number', field: 'amount' }

    if(!price) return { isAccepted: false, message: 'Price is required', field: 'price' }

    if(typeof price != 'number') return { isAccepted: false, message: 'Price must be a number', field: 'price' }
    
    return { isAccepted: true, message: 'data is valid', data: item }
}

const itemsValidation = (items, lang) => {

    for(let i=0;i<items.length;i++) {
        const item = items[i]
        const dataValidation = itemValidation(item, lang)

        if(!dataValidation.isAccepted) {
            return dataValidation
        }
    }

    return { isAccepted: true, message: 'data is valid', data: items }
}


const receiveItem = (paymentData, lang) => {

    const { supplierId, staffId, items } = paymentData

    if(!supplierId) return { isAccepted: false, message: 'Supplier Id is required', field: 'supplierId' }

    if(!utils.isObjectId(supplierId)) return { isAccepted: false, message: 'Invalid supplier Id formate', field: 'supplierId' }

    if(!staffId) return { isAccepted: false, message: 'Staff Id is required', field: 'staffId' }

    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id formate', field: 'staffId' }

    if(!Array.isArray(items)) return { isAccepted: false, message: 'Items must be a list', field: 'items' }

    if(!items.length)  return { isAccepted: false, message: 'No items in the list', field: 'items' }

    const dataValidation = itemsValidation(items, lang)

    if(!dataValidation.isAccepted) return { isAccepted: dataValidation.isAccepted, message: dataValidation.message, field: dataValidation.field}

    const itemsIdsList = items.map(item => item.itemId)
    if(!utils.isListUnique(itemsIdsList)) return { isAccepted: false, message: 'There is duplicates in items Ids', field: 'items' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

const deductItem = (paymentData, lang) => {

    const { staffId, items } = paymentData

    if(!staffId) return { isAccepted: false, message: 'Staff Id is required', field: 'staffId' }

    if(!utils.isObjectId(staffId)) return { isAccepted: false, message: 'Invalid staff Id formate', field: 'staffId' }

    if(!Array.isArray(items)) return { isAccepted: false, message: 'Items must be a list', field: 'items' }

    if(!items.length)  return { isAccepted: false, message: 'No items in the list', field: 'items' }

    const dataValidation = itemsValidation(items, lang)

    if(!dataValidation.isAccepted) return { isAccepted: dataValidation.isAccepted, message: dataValidation.message, field: dataValidation.field}

    const itemsIdsList = items.map(item => item.itemId)
    if(!utils.isListUnique(itemsIdsList)) return { isAccepted: false, message: 'There is duplicates in items Ids', field: 'items' }

    return { isAccepted: true, message: 'data is valid', data: paymentData }

}

module.exports = { receiveItem, deductItem }