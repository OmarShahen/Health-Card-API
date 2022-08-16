const config = require('../config/config')

const isCountryCodeValid = (code) => {

    const codes = config.COUNTRY_CODES

    for(let i=0;i<codes.length;i++) {

        if(codes[i] == code) {
            return true
        }
    }

    return false
}

module.exports = { isCountryCodeValid }