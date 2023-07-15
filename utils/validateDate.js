const moment = require('moment')

const isDateValid = (date) => {
    return moment(date, 'YYYY-MM-DD', true).isValid()
}

const isDateTimeValid = (dateTime) => {

    const timestamp = Date.parse(dateTime);

    if (isNaN(timestamp)) {
        return false
    }

    return true

    //return moment(dateTime, 'YYYY-MM-DD HH:mm:ss', true).isValid()
}

const isBirthYearValid = (date) => {
    return moment(date, 'YYYY', true).isValid()
}

module.exports = { isDateValid, isBirthYearValid, isDateTimeValid }