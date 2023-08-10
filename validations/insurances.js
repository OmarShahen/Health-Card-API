const utils = require('../utils/utils')

const addInsurance = (insuranceData) => {

    const { name, clinicId } = insuranceData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    if(!clinicId) return { isAccepted: false, message: 'Clinic ID is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'Invalid clinic ID format', field: 'clinicId' }


    return { isAccepted: true, message: 'data is valid', data: insuranceData }
}

const updateInsurance = (insuranceData) => {

    const { name } = insuranceData

    if(!name) return { isAccepted: false, message: 'Name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'Invalid name format', field: 'name' }

    return { isAccepted: true, message: 'data is valid', data: insuranceData }

}

module.exports = { addInsurance, updateInsurance }