const utils = require('../utils/utils')
const config = require('../config/config')

const addOpeningTime = (openingTimeData) => {

    const { leadId, clinicId, weekday, openingTime, closingTime } = openingTimeData

    if(!leadId && !clinicId) return { isAccepted: false, message: 'Entity relation is required', field: 'leadId' }

    if(clinicId && !utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Clinic Id format is invalid', field: 'clinicId' }

    if(leadId && !utils.isObjectId(leadId)) return { isAccepted: false, message: 'Lead Id format is invalid', field: 'leadId' }

    if(!weekday) return { isAccepted: false, message: 'Weekday is required', field: 'weekday' }

    if(!config.WEEK_DAYS.includes(weekday)) return { isAccepted: false, message: 'Weekday format is invalid', field: 'weekday' }

    if(!openingTime) return { isAccepted: false, message: 'Opening time is required', field: 'openingTime' }

    if(!utils.isTimeValid(openingTime)) return { isAccepted: false, message: 'Opening time format is invalid', field: 'openingTime' }

    if(!closingTime) return { isAccepted: false, message: 'Closing time is required', field: 'closingTime' }

    if(!utils.isTimeValid(closingTime)) return { isAccepted: false, message: 'Closing time format is invalid', field: 'closingTime' }

    return { isAccepted: true, message: 'data is valid', data: openingTimeData }

}

const updateOpeningTime = (openingTimeData) => {

    const { weekday, openingTime, closingTime } = openingTimeData

    if(!weekday) return { isAccepted: false, message: 'Weekday is required', field: 'weekday' }

    if(!config.WEEK_DAYS.includes(weekday)) return { isAccepted: false, message: 'Weekday format is invalid', field: 'weekday' }

    if(!openingTime) return { isAccepted: false, message: 'Opening time is required', field: 'openingTime' }

    if(!utils.isTimeValid(openingTime)) return { isAccepted: false, message: 'Opening time format is invalid', field: 'openingTime' }

    if(!closingTime) return { isAccepted: false, message: 'Closing time is required', field: 'closingTime' }

    if(!utils.isTimeValid(closingTime)) return { isAccepted: false, message: 'Closing time format is invalid', field: 'closingTime' }

    return { isAccepted: true, message: 'data is valid', data: openingTimeData }

}

module.exports = { addOpeningTime, updateOpeningTime }