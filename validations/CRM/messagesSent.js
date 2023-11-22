const utils = require('../../utils/utils')
const config = require('../../config/config')


const addMessageSent = (messageSentData) => {

    const { messageTemplateId, leadId, platform, isOpened, openedDate, isResponded, respondedDate, isCTADone } = messageSentData

    if(!messageTemplateId) return { isAccepted: false, message: 'Message template ID is required', field: 'messageTemplateId' }

    if(!utils.isObjectId(messageTemplateId)) return { isAccepted: false, message: 'Message template ID format is invalid', field: 'messageTemplateId' }
    
    if(!leadId) return { isAccepted: false, message: 'Lead ID is required', field: 'leadId' }

    if(!utils.isObjectId(leadId)) return { isAccepted: false, message: 'Lead ID format is invalid', field: 'leadId' }
        
    if(!platform) return { isAccepted: false, message: 'Platform is required', field: 'platform' }

    if(typeof platform != 'string') return { isAccepted: false, message: 'Platform format is invalid', field: 'platform' }

    if(!config.MESSAGE_SENT_PLATFORMS.includes(platform)) return { isAccepted: false, message: 'Platform value is not valid', field: 'platform' }

    /*if(typeof isOpened != 'boolean') return { isAccepted: false, message: 'Opened format is invalid', field: 'isOpened' }

    if(!openedDate) return { isAccepted: false, message: 'Opened date is required', field: 'openedDate' }

    if(!utils.isDateTimeValid(openedDate)) return { isAccepted: false, message: 'Opened date format is invalid', field: 'openedDate' }
    
    if(typeof isResponded != 'boolean') return { isAccepted: false, message: 'Responded format is invalid', field: 'isResponded' }

    if(!respondedDate) return { isAccepted: false, message: 'Responded date is required', field: 'respondedDate' }

    if(!utils.isDateTimeValid(respondedDate)) return { isAccepted: false, message: 'Responded date format is invalid', field: 'respondedDate' }

    if(typeof isCTADone != 'boolean') return { isAccepted: false, message: 'CTA format is invalid', field: 'isCTADone' }*/

    return { isAccepted: true, message: 'data is valid', data: messageSentData }
}

const updateMessageSent = (messageSentData) => {

    const { platform, isOpened, openedDate, isResponded, respondedDate, isCTADone } = messageSentData
            
    if(!platform) return { isAccepted: false, message: 'Platform is required', field: 'platform' }

    if(typeof platform != 'string') return { isAccepted: false, message: 'Platform format is invalid', field: 'platform' }

    if(!config.MESSAGE_SENT_PLATFORMS.includes(platform)) return { isAccepted: false, message: 'Platform value is not valid', field: 'platform' }

    if(typeof isOpened != 'boolean') return { isAccepted: false, message: 'Opened format is invalid', field: 'isOpened' }

    if(isOpened && !openedDate) return { isAccepted: false, message: 'Opened date is required', field: 'openedDate' }

    if(isOpened && !utils.isDateTimeValid(openedDate)) return { isAccepted: false, message: 'Opened date format is invalid', field: 'openedDate' }
    
    if(typeof isResponded != 'boolean') return { isAccepted: false, message: 'Responded format is invalid', field: 'isResponded' }

    if(isResponded && !respondedDate) return { isAccepted: false, message: 'Responded date is required', field: 'respondedDate' }

    if(isResponded && !utils.isDateTimeValid(respondedDate)) return { isAccepted: false, message: 'Responded date format is invalid', field: 'respondedDate' }

    if(typeof isCTADone != 'boolean') return { isAccepted: false, message: 'CTA format is invalid', field: 'isCTADone' }

    return { isAccepted: true, message: 'data is valid', data: messageSentData }
}

const updateMessageSentCTA = (messageSentData) => {

    const { isCTADone } = messageSentData

    if(typeof isCTADone != 'boolean') return { isAccepted: false, message: 'CTA format is invalid', field: 'isCTADone' }

    return { isAccepted: true, message: 'data is valid', data: messageSentData }
}

const updateMessageSentOpen = (messageSentData) => {

    const { isOpened, openedDate } = messageSentData
            
    if(typeof isOpened != 'boolean') return { isAccepted: false, message: 'Opened format is invalid', field: 'isOpened' }

    if(!openedDate) return { isAccepted: false, message: 'Opened date is required', field: 'openedDate' }

    if(!utils.isDateTimeValid(openedDate)) return { isAccepted: false, message: 'Opened date format is invalid', field: 'openedDate' }
    
    return { isAccepted: true, message: 'data is valid', data: messageSentData }
}

const updateMessageSentRespond = (messageSentData) => {

    const { isResponded, respondedDate } = messageSentData

    if(typeof isResponded != 'boolean') return { isAccepted: false, message: 'Responded format is invalid', field: 'isResponded' }

    if(!respondedDate) return { isAccepted: false, message: 'Responded date is required', field: 'respondedDate' }

    if(!utils.isDateTimeValid(respondedDate)) return { isAccepted: false, message: 'Responded date format is invalid', field: 'respondedDate' }

    return { isAccepted: true, message: 'data is valid', data: messageSentData }
}

module.exports = { 
    addMessageSent, 
    updateMessageSent,
    updateMessageSentCTA,
    updateMessageSentOpen,
    updateMessageSentRespond
}