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
}

const isBirthYearValid = (date) => {
    return moment(date, 'YYYY', true).isValid()
}

const isTimeValid = timeString => {

    const format = 'HH:mm'
    const time = moment(timeString, format, true)
  
    if (time.isValid()) {
      return true
    } else {
      return false
    }
  }

module.exports = { isDateValid, isBirthYearValid, isDateTimeValid, isTimeValid }