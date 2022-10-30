const config = require('../config/config')
const translations = require('../i18n/index')

const isDatePeriodValid = (period, lang) => {

    const periodSplit = period.split(' ')

    if(periodSplit.length != 2) return { isAccepted: false, message: translations[lang]['Invalid expiration period formate'], field: 'expiresIn' }

    let periodNumber = periodSplit[0]
    const periodName = periodSplit[1]

    if(!Number.parseInt(periodNumber)) {
        return { isAccepted: false, message: translations[lang]['Period number must be a number'], field: 'expiresIn' }
    }


    const validPeriodsNamesList = config.EXPIRATION_PERIODS

    if(!validPeriodsNamesList.includes(periodName)) {
        return { isAccepted: false, message: translations[lang]['Invalid period name'], field: 'expiresIn' }
    }

    periodNumber = Number.parseInt(periodNumber)


    if((periodName == 'day' || periodName == 'days') && (periodNumber > 365 || periodNumber < 0)) {

        return { isAccepted: false, message: translations[lang]['Days must be between 1 to 365 days'] }

    } else if((periodName == 'week' || periodName == 'weeks') && (periodNumber > 48 || periodNumber < 0)) {

        return { isAccepted: false, message: translations[lang]['Weeks must be between 1 to 48 weeks'] }

    } else if((periodName == 'month' || periodName == 'months') && (periodNumber > 12 || periodNumber < 0)) {

        return { isAccepted: false, message: translations[lang]['Months must be between 1 to 12 months'] }

    } else if((periodName == 'year') && (periodNumber > 1 || periodNumber < 0)) {

        return { isAccepted: false, message: translations[lang]['Only 1 year period is valid'] }

    }

    return { isAccepted: true, message: 'valid data', data: period }

}

module.exports = { isDatePeriodValid }