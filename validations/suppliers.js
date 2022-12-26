const validator = require('../utils/utils')
const translations = require('../i18n/index')


const addSupplier = (supplierData, lang) => {

    const { name, phone, countryCode, description } = supplierData

    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: translations[lang]['Invalid name formate'], field: 'name' }

    if(!phone) return { isAccepted: false, message: translations[lang]['Phone is required'], field: 'phone' }
    
    if(!validator.isPhoneValid(String(phone), 10)) return { isAccepted: false, message: translations[lang]['Phone formate is invalid'], field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: translations[lang]['Country code is required'], field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: translations[lang]['Invalid country code'], field: 'countryCode' }

    if(!description) return { isAccepted: false, message: translations[lang]['Description is required'], field: 'description' }


    return { isAccepted: true, message: 'data is valid', data: supplierData }

}

const updateSupplier = (supplierData, lang) => {

    const { name, description, phone, countryCode } = supplierData

    if(!name) return { isAccepted: false, message: translations[lang]['Name is required'], field: 'name' }

    if(!validator.isNameValid(name)) return { isAccepted: false, message: translations[lang]['Invalid name formate'], field: 'name' }

    if(!phone) return { isAccepted: false, message: translations[lang]['Phone is required'], field: 'phone' }

    if(!validator.isPhoneValid(String(phone), 10)) return { isAccepted: false, message: translations[lang]['Phone formate is invalid'], field: 'phone' }

    if(!countryCode) return { isAccepted: false, message: translations[lang]['Country code is required'], field: 'countryCode' }

    if(!validator.isCountryCodeValid(countryCode)) return { isAccepted: false, message: translations[lang]['Invalid country code'], field: 'countryCode' }

    if(!description) return { isAccepted: false, message: translations[lang]['Description is required'], field: 'description' }

    return { isAccepted: true, message: 'data is valid', data: supplierData }

}


module.exports = { addSupplier, updateSupplier }
