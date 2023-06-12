const utils = require('../utils/utils')

const addClinicDoctor = (clinicDoctorData) => {

    const { doctorId, clinicId } = clinicDoctorData

    if(!doctorId) return { isAccepted: false, message: 'doctor Id is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'doctor Id format is invalid', field: 'doctorId' }

    if(!clinicId) return { isAccepted: false, message: 'clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'clinic Id format is invalid', field: 'clinicId' }

    return { isAccepted: true, message: 'data is valid', data: clinicDoctorData }
    
}



module.exports = { addClinicDoctor }