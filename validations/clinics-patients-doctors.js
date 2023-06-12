const utils = require('../utils/utils')

const addClinicPatientDoctor = (clinicPatientData) => {

    const { patientId, clinicId, doctorId } = clinicPatientData

    if(!patientId) return { isAccepted: false, message: 'patient Id is required', field: 'patientId' }

    if(!utils.isObjectId(patientId)) return { isAccepted: false, message: 'patient Id format is invalid', field: 'patientId' }

    if(!clinicId) return { isAccepted: false, message: 'clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'clinic Id format is invalid', field: 'clinicId' }

    if(!doctorId) return { isAccepted: false, message: 'doctor Id is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'doctor Id format is invalid', field: 'doctorId' }


    return { isAccepted: true, message: 'data is valid', data: clinicPatientData }
    
}

const addClinicPatientDoctorByCardId = (clinicPatientData) => {

    const { cardId, clinicId, doctorId } = clinicPatientData

    if(!cardId) return { isAccepted: false, message: 'card Id is required', field: 'cardId' }

    if(typeof cardId != 'number') return { isAccepted: false, message: 'card Id format is invalid', field: 'cardId' }

    if(!clinicId) return { isAccepted: false, message: 'clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'clinic Id format is invalid', field: 'clinicId' }

    if(!doctorId) return { isAccepted: false, message: 'doctor Id is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'doctor Id format is invalid', field: 'doctorId' }


    return { isAccepted: true, message: 'data is valid', data: clinicPatientData }
    
}



module.exports = { addClinicPatientDoctor, addClinicPatientDoctorByCardId }