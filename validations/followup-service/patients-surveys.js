const utils = require('../../utils/utils')
const config = require('../../config/config')

const addPatientSurvey = (patientSurveyData) => {

    const { 
        doctorId,
        reviewerId,
        doneById,
        overallExperience,
        comment,
        serviceIdeaRate,
        serviceIdeaComment,
        callDuration,
        waitingTimeWaited,
        waitingIsDelayHappened,
        waitingIsDelayInformed,
        waitingSatisfaction,
        environmentIsClean,
        environmentIsComfortable,
        staffIsFriendly,
        staffIsResponsive,
        healthcareProviderAttentiveness,
        healthcareProviderIsAddressedAdequately,
        healthcareProviderTreatmentExplanation,
        healthcareProviderIsMedicalHistoryAsked,
        appointmentsIsConvenientTimeSlotFound,
        appointmentsIsSchedulingEasy,
        appointmentsIsReminderSent,
        appointmentsSchedulingWay,
    } = patientSurveyData

    if(!doctorId) return { isAccepted: false, message: 'Doctor ID is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'Invalid doctor ID format', field: 'doctorId' }

    if(!doneById) return { isAccepted: false, message: 'Done By ID is required', field: 'doneById' }

    if(!utils.isObjectId(doneById)) return { isAccepted: false, message: 'Invalid done by ID format', field: 'doneById' }

    if(!reviewerId) return { isAccepted: false, message: 'Reviewer ID is required', field: 'reviewerId' }

    if(!utils.isObjectId(reviewerId)) return { isAccepted: false, message: 'Invalid reviewer ID format', field: 'reviewerId' }

    if(comment && typeof comment != 'string') return { isAccepted: false, message: 'Invalid comment format', field: 'comment' }

    if(typeof overallExperience != 'number') 
        return { isAccepted: false, message: 'Overall experience format is invalid', field: 'overallExperience' }
    
    if(serviceIdeaRate && typeof serviceIdeaRate != 'number')
        return { isAccepted: false, message: 'Service idea rate format is invalid', field: 'serviceIdeaRate' }

    if(serviceIdeaComment && typeof serviceIdeaComment != 'string')
        return { isAccepted: false, message: 'Service idea comment format is invalid', field: 'serviceIdeaComment' }

    if(callDuration && typeof callDuration != 'number') 
        return { isAccepted: false, message: 'Call duration format is invalid', field: 'callDuration' }

    if(waitingTimeWaited && typeof waitingTimeWaited != 'number') 
        return { isAccepted: false, message: 'waiting time format is invalid', field: 'waitingTimeWaited' }

    if(waitingIsDelayHappened && typeof waitingIsDelayHappened != 'boolean') 
        return { isAccepted: false, message: 'waiting is delayed happened format is invalid', field: 'waitingIsDelayHappened' }

    if(waitingIsDelayInformed && typeof waitingIsDelayInformed != 'boolean') 
        return { isAccepted: false, message: 'waiting is delay informed format is invalid', field: 'waitingIsDelayInformed' }

    if(waitingSatisfaction && typeof waitingSatisfaction != 'number') 
        return { isAccepted: false, message: 'waiting satisfaction format is invalid', field: 'waitingSatisfaction' }

    if(environmentIsClean && typeof environmentIsClean != 'boolean') 
        return { isAccepted: false, message: 'environment is clean format is invalid', field: 'environmentIsClean' }

    if(environmentIsComfortable && typeof environmentIsComfortable != 'boolean') 
        return { isAccepted: false, message: 'environment is comfortable format is invalid', field: 'environmentIsComfortable' }

    if(staffIsFriendly && typeof staffIsFriendly != 'boolean') 
        return { isAccepted: false, message: 'staff is friendly format is invalid', field: 'staffIsFriendly' }

    if(staffIsResponsive && typeof staffIsResponsive != 'boolean') 
        return { isAccepted: false, message: 'staff is responsive format is invalid', field: 'staffIsResponsive' }

    if(healthcareProviderAttentiveness && typeof healthcareProviderAttentiveness != 'number') 
        return { isAccepted: false, message: 'healthcare provider attentiveness format is invalid', field: 'healthcareProviderAttentiveness' }

    if(healthcareProviderIsAddressedAdequately && typeof healthcareProviderIsAddressedAdequately != 'boolean') 
        return { isAccepted: false, message: 'healthcare provider is addressed adequately format is invalid', field: 'healthcareProviderIsAddressedAdequately' }

    if(healthcareProviderTreatmentExplanation && typeof healthcareProviderTreatmentExplanation != 'number') 
        return { isAccepted: false, message: 'healthcare provider is treatment explained clearly format is invalid', field: 'healthcareProviderTreatmentExplanation' }

    if(healthcareProviderIsMedicalHistoryAsked && typeof healthcareProviderIsMedicalHistoryAsked != 'boolean') 
        return { isAccepted: false, message: 'healthcare provider is medical history asked format is invalid', field: 'healthcareProviderIsMedicalHistoryAsked' }

    if(appointmentsIsConvenientTimeSlotFound && typeof appointmentsIsConvenientTimeSlotFound != 'boolean') 
        return { isAccepted: false, message: 'appointment is convenient time slot found format is invalid', field: 'appointmentsIsConvenientTimeSlotFound' }

    if(appointmentsIsSchedulingEasy && typeof appointmentsIsSchedulingEasy != 'boolean') 
        return { isAccepted: false, message: 'appointment is scheduling easy format is invalid', field: 'appointmentsIsSchedulingEasy' }

    if(appointmentsIsReminderSent && typeof appointmentsIsReminderSent != 'boolean') 
        return { isAccepted: false, message: 'appointment is reminder sent format is invalid', field: 'appointmentsIsReminderSent' }

    if(appointmentsSchedulingWay && typeof appointmentsSchedulingWay != 'string') 
        return { isAccepted: false, message: 'appointment scheduling way format is invalid', field: 'appointmentsSchedulingWay' }

    if(appointmentsSchedulingWay && !config.SCHEDULING_WAYS.includes(appointmentsSchedulingWay)) 
        return { isAccepted: false, message: 'Invalid value for appointment scheduling way', field: 'appointmentsSchedulingWay' }


    return { isAccepted: true, message: 'data is valid', data: patientSurveyData }
}

const updatePatientSurvey = (patientSurveyData) => {

    const { 
        arrivalMethodId,
        overallExperience,
        serviceIdeaRate,
        serviceIdeaComment,
        callDuration,
        waitingTimeWaited,
        waitingIsDelayHappened,
        waitingIsDelayInformed,
        waitingSatisfaction,
        environmentIsClean,
        environmentIsComfortable,
        staffIsFriendly,
        staffIsResponsive,
        healthcareProviderAttentiveness,
        healthcareProviderIsAddressedAdequately,
        healthcareProviderTreatmentExplanation,
        healthcareProviderIsMedicalHistoryAsked,
        appointmentsIsConvenientTimeSlotFound,
        appointmentsIsSchedulingEasy,
        appointmentsIsReminderSent,
        appointmentsSchedulingWay,
    } = patientSurveyData


    if(arrivalMethodId && !utils.isObjectId(arrivalMethodId))
        return { isAccepted: false, message: 'Arrival method format is invalid is required', field: 'arrivalMethodId' }

    if(typeof overallExperience != 'number') 
        return { isAccepted: false, message: 'Overall experience format is invalid', field: 'overallExperience' }

    if(serviceIdeaRate && typeof serviceIdeaRate != 'number')
        return { isAccepted: false, message: 'Service idea rate format is invalid', field: 'serviceIdeaRate' }

    if(serviceIdeaComment && typeof serviceIdeaComment != 'string')
        return { isAccepted: false, message: 'Service idea comment format is invalid', field: 'serviceIdeaComment' }

    if(callDuration && typeof callDuration != 'number') 
        return { isAccepted: false, message: 'Call duration format is invalid', field: 'callDuration' }

    if(waitingTimeWaited && typeof waitingTimeWaited != 'number') 
        return { isAccepted: false, message: 'waiting time format is invalid', field: 'waitingTimeWaited' }        

    if(waitingIsDelayHappened && typeof waitingIsDelayHappened != 'boolean') 
        return { isAccepted: false, message: 'waiting is delayed happened format is invalid', field: 'waitingIsDelayHappened' }

    if(waitingIsDelayInformed && typeof waitingIsDelayInformed != 'boolean') 
        return { isAccepted: false, message: 'waiting is delay informed format is invalid', field: 'waitingIsDelayInformed' }

    if(waitingSatisfaction && typeof waitingSatisfaction != 'number') 
        return { isAccepted: false, message: 'waiting satisfaction format is invalid', field: 'waitingSatisfaction' }

    if(environmentIsClean && typeof environmentIsClean != 'boolean') 
        return { isAccepted: false, message: 'environment is clean format is invalid', field: 'environmentIsClean' }

    if(environmentIsComfortable && typeof environmentIsComfortable != 'boolean') 
        return { isAccepted: false, message: 'environment is comfortable format is invalid', field: 'environmentIsComfortable' }

    if(staffIsFriendly && typeof staffIsFriendly != 'boolean') 
        return { isAccepted: false, message: 'staff is friendly format is invalid', field: 'staffIsFriendly' }

    if(staffIsResponsive && typeof staffIsResponsive != 'boolean') 
        return { isAccepted: false, message: 'staff is responsive format is invalid', field: 'staffIsResponsive' }

    if(healthcareProviderAttentiveness && typeof healthcareProviderAttentiveness != 'number') 
        return { isAccepted: false, message: 'healthcare provider attentiveness format is invalid', field: 'healthcareProviderAttentiveness' }

    if(healthcareProviderIsAddressedAdequately && typeof healthcareProviderIsAddressedAdequately != 'boolean') 
        return { isAccepted: false, message: 'healthcare provider is addressed adequately format is invalid', field: 'healthcareProviderIsAddressedAdequately' }

    if(healthcareProviderTreatmentExplanation && typeof healthcareProviderTreatmentExplanation != 'number') 
        return { isAccepted: false, message: 'healthcare provider treatment explained clearly format is invalid', field: 'healthcareProviderTreatmentExplanation' }

    if(healthcareProviderIsMedicalHistoryAsked && typeof healthcareProviderIsMedicalHistoryAsked != 'boolean') 
        return { isAccepted: false, message: 'healthcare provider is medical history asked format is invalid', field: 'healthcareProviderIsMedicalHistoryAsked' }

    if(appointmentsIsConvenientTimeSlotFound && typeof appointmentsIsConvenientTimeSlotFound != 'boolean') 
        return { isAccepted: false, message: 'appointment is convenient time slot found format is invalid', field: 'appointmentsIsConvenientTimeSlotFound' }

    if(appointmentsIsSchedulingEasy && typeof appointmentsIsSchedulingEasy != 'boolean') 
        return { isAccepted: false, message: 'appointment is scheduling easy format is invalid', field: 'appointmentsIsSchedulingEasy' }

    if(appointmentsIsReminderSent && typeof appointmentsIsReminderSent != 'boolean') 
        return { isAccepted: false, message: 'appointment is reminder sent format is invalid', field: 'appointmentsIsReminderSent' }

    if(appointmentsSchedulingWay && typeof appointmentsSchedulingWay != 'string') 
        return { isAccepted: false, message: 'appointment scheduling way format is invalid', field: 'appointmentsSchedulingWay' }

    if(appointmentsSchedulingWay && !config.SCHEDULING_WAYS.includes(appointmentsSchedulingWay)) 
        return { isAccepted: false, message: 'Invalid value for appointment scheduling way', field: 'appointmentsSchedulingWay' }


    return { isAccepted: true, message: 'data is valid', data: patientSurveyData }
}


module.exports = { addPatientSurvey, updatePatientSurvey }