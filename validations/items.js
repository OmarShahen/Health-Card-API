const validator = require('../utils/utils')
const translations = require('../i18n/index')


const addItem = (itemData, lang) => {

    const { name, price, initialStock } = itemData

    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!price) return { isAccepted: false, message: translations[lang]['Price is required'], field: 'price' }
    
    if(typeof price != 'number') return { isAccepted: false, message: translations[lang]['Price is invalid'], field: 'price' }

    if(!initialStock) return { isAccepted: false, message: translations[lang]['Initial stock is required'], field: 'initialStock' }

    if(typeof initialStock != 'number') return { isAccepted: false, message: translations[lang]['Initial stock is invalid'], field: 'initialStock' }


    return { isAccepted: true, message: 'data is valid', data: itemData }

}

const updateItem = (itemData, lang) => {

    const { name, price } = itemData

    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!price) return { isAccepted: false, message: translations[lang]['Price is required'], field: 'price' }
    
    if(typeof price != 'number') return { isAccepted: false, message: translations[lang]['Price is invalid'], field: 'price' }

    return { isAccepted: true, message: 'data is valid', data: itemData }

}

module.exports = { addItem, updateItem }