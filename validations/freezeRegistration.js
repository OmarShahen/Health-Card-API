const validator = require('../utils/utils')

const freezeData = (freezeData) => {

    const { registrationId, staffId, freezeDuration } = freezeData

    if(!registrationId) return { isAccepted: false, message: 'registration Id is required', field: 'registrationId' }

    if(!validator.isObjectId(registrationId)) return { isAccepted: false, message: 'invalid registration Id formate', field: 'registrationId' }

    if(!staffId) return { isAccepted: false, message: 'staff Id is required', field: 'staffId' }

    if(!validator.isObjectId(staffId)) return { isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' }

    if(!freezeDuration) return { isAccepted: false, message: 'freeze duration is required', field: 'freezeDuration' }

    const validateFreezeDuration = validator.isDatePeriodValid(freezeDuration)

    if(!validateFreezeDuration.isAccepted) {
        validateFreezeDuration.field = 'freezeDuration'
        return validateFreezeDuration
    }

    return { isAccepted: true, message: 'data is valid', data: freezeData }
}

const reactivateRegistrationData = (reactivateRegistrationData) => {

    const { staffId } = reactivateRegistrationData


    if(!staffId) return { isAccepted: false, message: 'staff Id is required', field: 'staffId' }

    if(!validator.isObjectId(staffId)) return { isAccepted: false, message: 'invalid staff Id formate', field: 'staffId' }

    return { isAccepted: true, message: 'data is valid', data: freezeData }
}

module.exports = { freezeData, reactivateRegistrationData } 