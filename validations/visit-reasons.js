const utils = require('../utils/utils')

const addVisitReason = (visitReasonData) => {

    const { name, description } = visitReasonData


    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name formate', field: 'name' }

    if(description && typeof description != 'string') return { isAccepted: false, message: 'Invalid description formate', field: 'description' }
    

    return { isAccepted: true, message: 'data is valid', data: visitReasonData }

}

const updateVisitReason = (visitReasonData) => {

    const { name, description } = visitReasonData

    if(!name) return { isAccepted: false, message: 'name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name formate', field: 'name' }

    if(description && !utils.isNameValid(description)) return { isAccepted: false, message: 'Invalid description formate', field: 'description' }
    

    return { isAccepted: true, message: 'data is valid', data: visitReasonData }

}



module.exports = { addVisitReason, updateVisitReason }