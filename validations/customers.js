const utils = require('../utils/utils')


const addCustomer = (customerData) => {

    const { expertId, seekerId } = customerData

    if(!expertId) return { isAccepted: false, message: 'Expert ID is required', field: 'expertId' }

    if(!utils.isObjectId(expertId)) return { isAccepted: false, message: 'Invalid expert ID format', field: 'expertId' }

    if(!seekerId) return { isAccepted: false, message: 'Seeker ID is required', field: 'seekerId' }

    if(!utils.isObjectId(seekerId)) return { isAccepted: false, message: 'Invalid seeker ID format', field: 'seekerId' }


    return { isAccepted: true, message: 'data is valid', data: customerData }
}


module.exports = { addCustomer }