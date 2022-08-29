const moment = require('moment')

const isDateValid = (date) => {
    return moment(date, 'YYYY-MM-DD', true).isValid()
}

module.exports = { isDateValid }