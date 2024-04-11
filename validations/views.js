const utils = require('../utils/utils')

const addView = (viewData) => {

    const { expertId, seekerId, page } = viewData

    if(!expertId) return { isAccepted: false, message: 'Expert ID is required', field: 'expertId' }

    if(!utils.isObjectId(expertId)) return { isAccepted: false, message: 'Invalid expert ID format', field: 'expertId' }

    if(!seekerId) return { isAccepted: false, message: 'Seeker ID is required', field: 'seekerId' }

    if(!utils.isObjectId(seekerId)) return { isAccepted: false, message: 'Invalid seeker ID format', field: 'seekerId' }

    if(page && typeof page != 'string') return { isAccepted: false, message: 'Page format is invalid', field: 'page' }
    
    return { isAccepted: true, message: 'data is valid', data: viewData }
}

module.exports = { addView }