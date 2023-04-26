const moment = require('moment')

const isDateValid = (date) => {
    return moment(date, 'YYYY-MM-DD', true).isValid()
}

const isBirthYearValid = (date) => {
    return moment(date, 'YYYY', true).isValid()
}

module.exports = { isDateValid, isBirthYearValid }