const utils = require('../utils/utils')
const config = require('../config/config')
const moment = require('moment')

const addAppointment = (appointmentData) => {

    const { doctorId, patientName, patientPhone, patientCountryCode, status, reservationTime } = appointmentData

    if(!doctorId) return { isAccepted: false, message: 'doctor Id is required', field: 'doctorId' }

    if(!utils.isObjectId(doctorId)) return { isAccepted: false, message: 'invalid doctor Id format', field: 'doctorId' }

    if(!patientName) return { isAccepted: false, message: 'patient name is required', field: 'patientName' }

    if(typeof patientName != 'string') return { isAccepted: false, message: 'invalid patient name format', field: 'patientName' }

    if(!patientPhone) return { isAccepted: false, message: 'patient phone is required', field: 'patientPhone' }

    if(typeof patientPhone != 'number') return { isAccepted: false, message: 'invalid patient phone format', field: 'patientPhone' }

    if(!patientCountryCode) return { isAccepted: false, message: 'patient country code is required', field: 'patientCountryCode' }

    if(typeof patientCountryCode != 'number') return { isAccepted: false, message: 'invalid patient country code format', field: 'patientCountryCode' }

    if(!status) return { isAccepted: false, message: 'status is required', field: 'status' }

    if(!config.APPOINTMENT_STATUS.includes(status)) return { isAccepted: false, message: 'invalid status value', field: 'status' }

    if(!reservationTime) return { isAccepted: false, message: 'reservation time is required', field: 'reservationTime' }

    if(!moment(reservationTime, "YYYY-MM-DDTHH:mm", true).isValid()) return { isAccepted: false, message: 'invalid date format', field: 'reservationTime' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}

const updateAppointmentStatus = (appointmentData) => {

    const { status } = appointmentData

    if(!status) return { isAccepted: false, message: 'Status is required', field: 'status' }

    if(!config.APPOINTMENT_STATUS.includes(status)) return { isAccepted: false, message: 'Status value is invalid', field: 'status' }

    return { isAccepted: true, message: 'data is valid', data: appointmentData }
}

module.exports = { addAppointment, updateAppointmentStatus }