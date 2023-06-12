const utils = require('../utils/utils')


const addService = (serviceData) => {

    const { clinicId, name, cost } = serviceData

    if(!clinicId) return { isAccepted: false, message: 'Clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Clinic Id format is invalid', field: 'clinicId' }

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!cost) return { isAccepted: false, message: 'Cost is required', field: 'cost' }

    if(typeof cost != 'number') return { isAccepted: false, message: 'Invalid cost format', field: 'cost' }


    return { isAccepted: true, message: 'data is valid', data: serviceData }

}

const updateService = (serviceData) => {

    const { name, cost } = serviceData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!cost) return { isAccepted: false, message: 'Cost is required', field: 'cost' }

    if(typeof cost != 'number') return { isAccepted: false, message: 'Invalid cost format', field: 'cost' }


    return { isAccepted: true, message: 'data is valid', data: serviceData }

}

module.exports = { addService, updateService }