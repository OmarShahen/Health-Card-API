const utils = require('../utils/utils')
const config = require('../config/config')

const addOpeningTime = (openingTimeData) => {

    const { leadId, expertId, weekday, openingTime, closingTime } = openingTimeData

    if(!leadId && !expertId) return { isAccepted: false, message: 'Entity relation is required', field: 'leadId' }

    if(expertId && !utils.isObjectId(expertId)) return { isAccepted: false, message: 'Expert Id format is invalid', field: 'expertId' }

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

const updateOpeningTimeActivityStatus = (openingTimeData) => {

    const { isActive } = openingTimeData

    if(typeof isActive != 'boolean') return { isAccepted: false, message: 'isActive format is invalid', field: 'isActive' }

    return { isAccepted: true, message: 'data is valid', data: openingTimeData }

}

module.exports = { addOpeningTime, updateOpeningTime, updateOpeningTimeActivityStatus }