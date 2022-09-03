const config = require('../config/config')

const isDatePeriodValid = (period) => {

    const periodSplit = period.split(' ')

    if(periodSplit.length != 2) return { isAccepted: false, message: 'invalid expiration period formate', field: 'expiresIn' }

    let periodNumber = periodSplit[0]
    const periodName = periodSplit[1]

    if(!Number.parseInt(periodNumber)) {
        return { isAccepted: false, message: 'period number must be a number', field: 'expiresIn' }
    }


    const validPeriodsNamesList = config.EXPIRATION_PERIODS

    if(!validPeriodsNamesList.includes(periodName)) {
        return { isAccepted: false, message: 'invalid period name', field: 'expiresIn' }
    }

    periodNumber = Number.parseInt(periodNumber)


    if((periodName == 'day' || periodName == 'days') && (periodNumber > 365 || periodNumber < 0)) {

        return { isAccepted: false, message: 'days must be between 1 to 365 days' }

    } else if((periodName == 'week' || periodName == 'weeks') && (periodNumber > 48 || periodNumber < 0)) {

        return { isAccepted: false, message: 'weeks must be between 1 to 48 weeks' }

    } else if((periodName == 'month' || periodName == 'months') && (periodNumber > 12 || periodNumber < 0)) {

        return { isAccepted: false, message: 'months must be between 1 to 12 months' }

    } else if((periodName == 'year') && (periodNumber > 1 || periodNumber < 0)) {

        return { isAccepted: false, message: 'only 1 year period is valid' }

    }

    return { isAccepted: true, message: 'valid data', data: period }

}

module.exports = { isDatePeriodValid }