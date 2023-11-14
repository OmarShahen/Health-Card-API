const utils = require('../../utils/utils')


const addStage = (stageData) => {

    const { leadId, stage, note } = stageData

    if(!leadId) return { isAccepted: false, message: 'Lead ID is required', field: 'leadId' }

    if(!utils.isObjectId(leadId)) return { isAccepted: false, message: 'Lead ID format is invalid', field: 'leadId' }

    if(!stage) return { isAccepted: false, message: 'Stage is required', field: 'stage' }
    
    if(typeof stage != 'string') return { isAccepted: false, message: 'Stage format is invalid', field: 'stage' }
    
    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }


    return { isAccepted: true, message: 'data is valid', data: stageData }
}

const updateStage = (stageData) => {

    const { stage, note } = stageData

    if(!stage) return { isAccepted: false, message: 'Stage is required', field: 'stage' }
    
    if(typeof stage != 'string') return { isAccepted: false, message: 'Stage format is invalid', field: 'stage' }
    
    if(note && typeof note != 'string') return { isAccepted: false, message: 'Note format is invalid', field: 'note' }


    return { isAccepted: true, message: 'data is valid', data: stageData }
}

module.exports = { addStage, updateStage }