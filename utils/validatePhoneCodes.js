const config = require('../config/config')

const isPhoneCountryCodeValid = (code) => {

    const codes = config.PHONE_COUNTRY_CODES

    for(let i=0;i<codes.length;i++) {

        if(codes[i] == code) {
            return true
        }
    }

    return false
}

module.exports = { isPhoneCountryCodeValid }