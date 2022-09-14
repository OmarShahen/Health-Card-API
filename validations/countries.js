const validator = require('../utils/utils')

const countryData = (countryData) => {

    const { name, code, currency } = countryData

    if(!name) return { isAccepted: false, message: 'country name is required', field: 'name' }
        
    if(!validator.isNameValid(name)) return { isAccepted: false, message: 'invalid country name formate', field: 'name' }

    if(!code) return { isAccepted: false, message: 'country code is required', field: 'code' }

    if(!Number.isInteger(code)) return { isAccepted: false, message: 'country code must be a number', field: 'code' }

    if(!currency) return { isAccepted: false, message: 'country currency is required', field: 'currency' }

    if(String(currency).length != 3) return { isAccepted: false, message: 'country currency must be 3 letters', field: 'currency' }


    return { isAccepted: true, message: 'valid data', data: countryData }
}

module.exports = { countryData }