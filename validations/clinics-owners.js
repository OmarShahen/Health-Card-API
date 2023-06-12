const utils = require('../utils/utils')

const addClinicOwner = (clinicOwnerData) => {

    const { clinicId, ownerId } = clinicOwnerData

    if(!clinicId) return { isAccepted: false, message: 'clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'clinic Id format is invalid', field: 'clinicId' }

    if(!ownerId) return { isAccepted: false, message: 'doctor Id is required', field: 'ownerId' }

    if(!utils.isObjectId(ownerId)) return { isAccepted: false, message: 'doctor Id format is invalid', field: 'ownerId' }

    return { isAccepted: true, message: 'data is valid', data: clinicOwnerData }
    
}



module.exports = { addClinicOwner }