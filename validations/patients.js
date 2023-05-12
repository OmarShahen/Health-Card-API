const config = require('../config/config')
const utils = require('../utils/utils')

const validateEmergencyContact = (emergencyContacts, patientPhone) => {

    let validPhoneNumbers = []

    for(let i=0;i<emergencyContacts.length;i++) {
        const contact = emergencyContacts[i]

        if(!contact.name || typeof contact.name != 'string') return { isAccepted: false, message: 'Emergency contact name is required', field: 'emergencyContacts.name' }

        if(!contact.relation || typeof contact.relation != 'string') return { isAccepted: false, message: 'Emergency contact relation is required', field: 'emergencyContacts.relation' }

        if(!contact.phone || typeof contact.phone != 'number') return { isAccepted: false, message: 'Emergency contact phone is required', field: 'emergencyContacts.phone' }

        if(validPhoneNumbers.includes(contact.phone)) return { isAccepted: false, message: 'Emergency contact number is already registered', field: 'emergencyContacts.phone' }

        if(patientPhone == contact.phone) return { isAccepted: false, message: 'Emergency contact cannot contain patient phone', field: 'emergencyContacts.phone' } 

        if(!contact.countryCode || typeof contact.countryCode != 'number') return { isAccepted: false, message: 'Emergency contact country code is required', field: 'emergencyContacts.countryCode' }

        validPhoneNumbers.push(contact.phone)
    }

    return { isAccepted: true, data: emergencyContacts }
}

const addPatient = (patientData) => {

    const { cardId, cardUUID, doctorId, firstName, lastName, email, countryCode, phone, gender, dateOfBirth, bloodGroup, weight, emergencyContacts, healthHistory } = patientData

    if(!cardId) return { isAccepted: false, message: 'card Id is required', field: 'cardId'}

    if(typeof cardId != 'number') return { isAccepted: false, message: 'card Id formate is invalid', field: 'cardId' } 

    //if(!cardUUID) return { isAccepted: false, message: 'card UUID is required', field: 'cardUUID'}

    //if(!utils.isUUIDValid(cardUUID)) return { isAccepted: false, message: 'card UUID formate is invalid', field: 'cardUUID' } 

    if(doctorId && !utils.isObjectId(doctorId)) return { isAccepted: false, message: 'Doctor Id is invalid', field: 'doctorId' }

    if(!firstName) return { isAccepted: false, message: 'First name is required', field: 'firstName' }

    if(!utils.isNameValid(firstName)) return { isAccepted: false, message: 'Invalid name formate', field: 'firstName' }

    if(!lastName) return { isAccepted: false, message: 'Last name is required', field: 'lastName' }

    if(!utils.isNameValid(lastName)) return { isAccepted: false, message: 'Invalid name formate', field: 'lastName' }

    if(email && !utils.isEmailValid(email)) return { isAccepted: false, message: 'Email formate is invalid', field: 'email' }

    if(!countryCode) return { isAccepted: false, message: 'Country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'Invalid country code', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'Phone is required', field: 'phone' }
    
    if(typeof phone != 'number') return { isAccepted: false, message: 'Phone formate is invalid', field: 'phone' }

    if(gender && !config.GENDER.includes(gender)) return { isAccepted: false, message: 'Invalid gender', field: 'gender' }

    if(dateOfBirth && !utils.isBirthYearValid(dateOfBirth)) return { isAccepted: false, message: 'Invalid date', field: 'dateOfBirth' }

    if(bloodGroup && !config.BLOOD_GROUPS.includes(bloodGroup)) return { isAccepted: false, message: 'Invalid blood group', field: 'bloodGroup' }

    if(weight && typeof weight != 'number') return { isAccepted: false, message: 'Weight must be a number', field: 'weight' }

    //if(!emergencyContacts) return { isAccepted: false, message: 'Emergency contacts is required', field: 'emergencyContacts' }
    
    if(emergencyContacts && !Array.isArray(emergencyContacts)) return { isAccepted: false, message: 'Emergency contacts must be a list', field: 'emergencyContacts' }

    if(emergencyContacts && emergencyContacts.length == 0) return { isAccepted: false, message: 'Emergency contacts must have atleast 1 contact', field: 'emergencyContacts' } 

    if(emergencyContacts) {
        const emergencyContactsDataValidation = validateEmergencyContact(emergencyContacts, phone)
        if(!emergencyContactsDataValidation.isAccepted) {
            return { isAccepted: emergencyContactsDataValidation.isAccepted, message: emergencyContactsDataValidation.message, field: emergencyContactsDataValidation.field }
        }
    }

    if(healthHistory?.isSmokingPast && typeof healthHistory.isSmokingPast != 'boolean') 
        return { isAccepted: false, message: 'Invalid value for smoking past', field: 'healthHistory.isSmokingPast' }

    if(healthHistory?.isSmokingPresent && typeof healthHistory.isSmokingPresent != 'boolean')
        return { isAccepted: false, message: 'Invalid value for smoking present', field: 'healthHistory.isSmokingPast' }

    if(healthHistory?.isAlcoholPast && typeof healthHistory.isAlcoholPast != 'boolean')
        return { isAccepted: false, message: 'Invalid value for alcohol past', field: 'healthHistory.isAlcoholPast' }

    if(healthHistory?.isAlcoholPresent && typeof healthHistory.isAlcoholPresent != 'boolean')
        return { isAccepted: false, message: 'Invalid value for alcohol present', field: 'healthHistory.isAlcoholPresent' }

    if(healthHistory?.isHospitalConfined && typeof healthHistory.isHospitalConfined != 'boolean')
        return { isAccepted: false, message: 'Invalid value for hospital confined', field: 'healthHistory.isHospitalConfined' }

    //if(healthHistory && !Array.isArray(healthHistory.hospitalConfinedReason))
      //  return { isAccepted: false, message: 'Invalid value for hospital confined reason', field: 'healthHistory.isHospitalConfined' }

    if(healthHistory?.isSurgicalOperations && typeof healthHistory.isSurgicalOperations != 'boolean')
        return { isAccepted: false, message: 'Invalid value for surgical operation', field: 'healthHistory.isSurgicalOperations' }
    
    //if(healthHistory && !Array.isArray(healthHistory.surgicalOperationsReason))
      //  return { isAccepted: false, message: 'Invalid value for surgical operation reason', field: 'healthHistory.isHospitalConfined' }

    if(healthHistory?.isAllergic && typeof healthHistory.isAllergic != 'boolean')
        return { isAccepted: false, message: 'Invalid value for allergic', field: 'healthHistory.isAllergic' }

    if(healthHistory?.isBloodTransfusion && typeof healthHistory.isBloodTransfusion != 'boolean')
        return { isAccepted: false, message: 'Invalid value for blood transfusion', field: 'healthHistory.isBloodTransfusion' }

    if(healthHistory?.isGeneticIssue && typeof healthHistory.isGeneticIssue != 'boolean')
        return { isAccepted: false, message: 'Invalid value for genetic issue', field: 'healthHistory.isGeneticIssue' }

    if(healthHistory?.isCancerFamily && typeof healthHistory.isCancerFamily != 'boolean')
        return { isAccepted: false, message: 'Invalid value for cancer family', field: 'healthHistory.isCancerFamily' }

    if(healthHistory?.isHighBloodPressure && typeof healthHistory.isHighBloodPressure != 'boolean')
        return { isAccepted: false, message: 'Invalid value for high blood pressure', field: 'healthHistory.isHighBloodPressure' }

    if(healthHistory?.isDiabetic && typeof healthHistory.isDiabetic != 'boolean')
        return { isAccepted: false, message: 'Invalid value for alcohol present', field: 'healthHistory.isDiabetic' }

    if(healthHistory?.isChronicHeart && typeof healthHistory.isChronicHeart != 'boolean')
        return { isAccepted: false, message: 'Invalid value for chronic heart', field: 'healthHistory.isChronicHeart' }

    if(healthHistory?.isChronicNeurological && typeof healthHistory.isChronicNeurological != 'boolean')
        return { isAccepted: false, message: 'Invalid value for chronic neurological', field: 'healthHistory.isChronicNeurological' }

    if(healthHistory?.isChronicLiver && typeof healthHistory.isChronicLiver != 'boolean')
        return { isAccepted: false, message: 'Invalid value for chronic liver', field: 'healthHistory.isChronicLiver' }

    if(healthHistory?.isChronicKidney && typeof healthHistory.isChronicKidney != 'boolean') 
        return { isAccepted: false, message: 'Invalid value for chronic kidney', field: 'healthHistory.isChronicKidney' }

    if(healthHistory?.isImmuneDiseases && typeof healthHistory.isImmuneDiseases != 'boolean') 
        return { isAccepted: false, message: 'Invalid value for immune diseases', field: 'healthHistory.isImmuneDiseases' }

    if(healthHistory?.isBloodDiseases && typeof healthHistory.isBloodDiseases != 'boolean') 
        return { isAccepted: false, message: 'Invalid value for blood diseases', field: 'healthHistory.isBloodDiseases' }


    return { isAccepted: true, message: 'data is valid', data: patientData }

}

const addDoctorToPatient = (patientData) => {

    const { doctorId } = patientData

    if(!doctorId) return { isAccepted: false, message: 'doctor Id is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'Invalid doctor Id formate', field: 'doctorId' }

    return { isAccepted: true, message: 'data is valid', data: patientData }

}

const addEmergencyContactToPatient = (contactData) => {

    const { name, countryCode, phone, relation } = contactData

    if(!name) return { isAccepted: false, message: 'contact name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'contact name is required', field: 'name' }

    if(!relation) return { isAccepted: false, message: 'contact relation is required', field: 'relation' }

    if(typeof relation != 'string') return { isAccepted: false, message: 'contact relation is required', field: 'relation' }

    if(!countryCode) return { isAccepted: false, message: 'contact country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'contact country code is required', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'contact phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'contact phone is required', field: 'phone' }

    return { isAccepted: true, message: 'data is valid', data: contactData }
}

const updateEmergencyContactOfPatient = (contactData) => {

    const { name, countryCode, phone, relation } = contactData

    if(!name) return { isAccepted: false, message: 'contact name is required', field: 'name' }

    if(typeof name != 'string') return { isAccepted: false, message: 'contact name is required', field: 'name' }

    if(!relation) return { isAccepted: false, message: 'contact relation is required', field: 'relation' }

    if(typeof relation != 'string') return { isAccepted: false, message: 'contact relation is required', field: 'relation' }

    if(!countryCode) return { isAccepted: false, message: 'contact country code is required', field: 'countryCode' }

    if(typeof countryCode != 'number') return { isAccepted: false, message: 'contact country code is required', field: 'countryCode' }

    if(!phone) return { isAccepted: false, message: 'contact phone is required', field: 'phone' }

    if(typeof phone != 'number') return { isAccepted: false, message: 'contact phone is required', field: 'phone' }

    return { isAccepted: true, message: 'data is valid', data: contactData }
}


module.exports = { 
    addPatient, 
    addDoctorToPatient, 
    addEmergencyContactToPatient, 
    updateEmergencyContactOfPatient 
}