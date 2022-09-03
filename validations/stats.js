const validator = require('../utils/utils')

const statsDates = (statsDates) => {

    const { from, to, until, specific } = statsDates

    if(from && !validator.isDateValid(from)) {
        return { isAccepted: false, message: 'invalid from date formate', field: 'from' }
    } 

    if(to && !validator.isDateValid(to)) {
        return { isAccepted: false, message: 'invalid to date formate', field: 'to' }
    }

    if(until && !validator.isDateValid(until)) {
        return { isAccepted: false, message: 'invalid until date formate', field: 'until' }
    }

    if(specific && !validator.isDateValid(specific)) {
        return { isAccepted: false, message: 'invalid specific date formate', field: 'specific' }
    }

    return { isAccepted: true, message: 'valid data', data: statsDates }
}

module.exports = { statsDates }