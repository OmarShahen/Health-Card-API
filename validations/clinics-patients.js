const utils = require('../utils/utils')

const addClinicPatient = (clinicPatientData) => {

    const { patientId, clinicId } = clinicPatientData

    if(!patientId) return { isAccepted: false, message: 'patient Id is required', field: 'patientId' }

    if(!utils.isObjectId(patientId)) return { isAccepted: false, message: 'patient Id format is invalid', field: 'patientId' }

    if(!clinicId) return { isAccepted: false, message: 'clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'clinic Id format is invalid', field: 'clinicId' }

    return { isAccepted: true, message: 'data is valid', data: clinicPatientData }
    
}

const addClinicPatientByCardId = (clinicPatientData) => {

    const { cardId, cvc, clinicId, doctorId } = clinicPatientData

    if(!cardId) return { isAccepted: false, message: 'card Id is required', field: 'cardId' }

    if(typeof cardId != 'number') return { isAccepted: false, message: 'card Id format is invalid', field: 'cardId' }

    if(!cvc) return { isAccepted: false, message: 'card cvc is required', field: 'cvc' }

    if(typeof cvc != 'number') return { isAccepted: false, message: 'card cvc format is invalid', field: 'cvc' }

    if(!clinicId) return { isAccepted: false, message: 'clinic Id is required', field: 'clinicId' }

    if(!utils.isObjectId(clinicId)) return { isAccepted: false, message: 'clinic Id format is invalid', field: 'clinicId' }

    if(doctorId && !utils.isObjectId(doctorId)) return { isAccepted: false, message: 'doctor Id format is invalid', field: 'doctorId' }


    return { isAccepted: true, message: 'data is valid', data: clinicPatientData }
    
}

const addPatientClinicLabel = (clinicPatientData) => {

    const { labelId } = clinicPatientData

    if(!labelId) return { isAccepted: false, message: 'Label ID is required', field: 'labelId' }
    
    if(!utils.isObjectId(labelId)) return { isAccepted: false, message: 'Label ID format is invalid', field: 'labelId' }    

    return { isAccepted: true, message: 'data is valid', data: clinicPatientData }
}

module.exports = { addClinicPatient, addClinicPatientByCardId, addPatientClinicLabel }