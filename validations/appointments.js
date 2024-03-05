const utils = require('../utils/utils')
const config = require('../config/config')

const addAppointment = (appointmentData) => {

    const { seekerId, expertId, serviceId, status, price, startTime, duration, isOnlineBooking } = appointmentData

    if(!seekerId) return { isAccepted: false, message: 'Seeker Id is required', field: 'seekerId' }

    if(!utils.isObjectId(seekerId)) return { isAccepted: false, message: 'invalid seeker Id format', field: 'seekerId' }

    if(!expertId) return { isAccepted: false, message: 'Expert Id is required', field: 'expertId' }

    if(!utils.isObjectId(expertId)) return { isAccepted: false, message: 'invalid expert Id format', field: 'expertId' }

    if(!serviceId) return { isAccepted: false, message: 'Service Id is required', field: 'serviceId' }

    if(!utils.isObjectId(serviceId)) return { isAccepted: false, message: 'Invalid service Id format', field: 'serviceId' }

    if(!status) return { isAccepted: false, message: 'status is required', field: 'status' }

    if(!config.APPOINTMENT_STATUS.includes(status)) return { isAccepted: false, message: 'invalid status value', field: 'status' }

    if(typeof price != 'number') return { isAccepted: false, message: 'Price format is invalid', field: 'price' }

    if(!duration) return { isAccepted: false, message: 'Duration is required', field: 'duration' }

    if(typeof duration != 'number') return { isAccepted: false, message: 'Duration format is invalid', field: 'duration' }

    if(!startTime) return { isAccepted: false, message: 'start time is required', field: 'startTime' }

    if(!utils.isDateTimeValid(startTime)) return { isAccepted: false, message: 'invalid start time format', field: 'startTime' }

    if(typeof isOnlineBooking != 'boolean') return { isAccepted: false, message: 'Invalid isOnlineBooking format', field: 'isOnlineBooking' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}

const updateAppointmentStatus = (appointmentData) => {

    const { status } = appointmentData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.APPOINTMENT_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}

const applyAppointmentPromoCode = (appointmentData) => {

    const { promoCode } = appointmentData

    if(!promoCode) return { isAccepted: false, message: 'Promo Code is required', field: 'promoCode' }

    if(typeof promoCode != 'string') return { isAccepted: false, message: 'Promo Code value is invalid', field: 'promoCode' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}

const updateAppointmentMeetingLink = (appointmentData) => {

    const { meetingLink } = appointmentData

    if(!meetingLink) return { isAccepted: false, message: 'Meeting link is required', field: 'meetingLink' }

    if(!utils.isValidURL(meetingLink)) return { isAccepted: false, message: 'Meeting URL value is invalid', field: 'meetingLink' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}

const updateAppointmentPaymentVerification = (appointmentData) => {

    const { transactionId, gateway } = appointmentData

    if(!transactionId) return { isAccepted: false, message: 'Transaction ID is required', field: 'transactionId' }

    if(typeof transactionId != 'string') return { isAccepted: false, message: 'Transaction ID format is invalid', field: 'transactionId' }

    if(!gateway) return { isAccepted: false, message: 'Gateway is required', field: 'gateway' }

    if(typeof gateway != 'string') return { isAccepted: false, message: 'Gateway format is invalid', field: 'gateway' }

    if(!config.PAYMENT_GATEWAYS.includes(gateway)) return { isAccepted: false, message: 'Gateway is not registered', field: 'gateway' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}

const updateAppointmentVerification = (appointmentData) => {

    const { verification } = appointmentData

    if(!verification) return { isAccepted: false, message: 'Verification is required', field: 'verification' }

    if(typeof verification != 'string') return { isAccepted: false, message: 'Verification format is invalid', field: 'verification' }

    if(!config.VERIFICATION_STATUS.includes(verification)) return { isAccepted: false, message: 'Verification is not registered', field: 'verification' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}


module.exports = { 
    addAppointment,
    applyAppointmentPromoCode,
    updateAppointmentStatus, 
    updateAppointmentMeetingLink, 
    updateAppointmentPaymentVerification,
    updateAppointmentVerification
}