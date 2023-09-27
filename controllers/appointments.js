const AppointmentModel = require('../models/AppointmentModel')
const PatientModel = require('../models/PatientModel')
const UserModel = require('../models/UserModel')
const ServiceModel = require('../models/ServiceModel')
const appointmentValidation = require('../validations/appointments')
const ClinicSubscriptionModel = require('../models/followup-service/ClinicSubscriptionModel')
const ClinicModel = require('../models/ClinicModel')
const utils = require('../utils/utils')
const { sendAppointmentEmail } = require('../mails/appointment')
const whatsappAppointmentReminder = require('../APIs/whatsapp/send-appointment-reminder')
const { format } = require('date-fns')
const translations = require('../i18n/index')
const mongoose = require('mongoose')


const addAppointment = async (request, response) => {

    try {

        const dataValidation = appointmentValidation.addAppointment(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { lang } = request.query

        const { 
            patientId,
            clinicId,
            doctorId, 
            serviceId, 
            status, 
            reservationTime,
            isSendMail
        } = request.body

        /*const todayDate = new Date() 
        if(todayDate > new Date(reservationTime)) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Reservation time has passed'],
                field: 'reservationTime'
            })
        }*/

        const patientPromise = PatientModel.findById(patientId)
        const clinicPromise = ClinicModel.findById(clinicId)
        const doctorPromise = UserModel.findById(doctorId)

        const [patient, clinic, doctor] = await Promise.all([
            patientPromise,
            clinicPromise,
            doctorPromise
        ])

        if(!patient) {
            return response.status(400).json({
                accepted: false,
                message: 'patient Id is not registered',
                field: 'patientId'
            })
        }

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id is not registered',
                field: 'clinicId'
            })
        }

        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor Id is not registered',
                field: 'doctorId'
            })
        }

        let serviceList = []

        if(serviceId) {
            serviceList = await ServiceModel.find({ _id: serviceId, clinicId })
            if(serviceList.length == 0) {
                return response.status(400).json({
                    accepted: false,
                    message: 'service Id is not registered',
                    field: 'serviceId'
                })
            }
        }

        const appointment = await AppointmentModel.find({ doctorId, reservationTime })
        if(appointment.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Doctor is already reserved in that time'],
                field: 'reservationTime'
            })
        }

        const appointmentData = { 
            patientId,
            clinicId,
            doctorId, 
            serviceId, 
            status,
            reservationTime
        }

        const appointmentObj = new AppointmentModel(appointmentData)
        const newAppointment = await appointmentObj.save()

        let reservationDateTime = newAppointment.reservationTime

        const appointmentDateTime = reservationDateTime.toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })


        const mailData = {
            receiverEmail: doctor.email,
            appointmentData: {
                clinicName: clinic.name,
                clinicCity: utils.capitalizeFirstLetter(clinic.city),
                serviceName: serviceId ? serviceList[0].name : 'Issue',
                appointmentDate: appointmentDateTime
            }

        }

        let mailStatus

        if(isSendMail) {
            mailStatus = await sendAppointmentEmail(mailData)
        }

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Registered appointment successfully!'],
            appointment: newAppointment,
            mailStatus
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getAppointmentsByDoctorId = async (request, response) => {

    try {

        const { userId } = request.params

        const { searchQuery } = utils
        .statsQueryGenerator('doctorId', userId, request.query, 'reservationTime')

        const appointments = await AppointmentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            },
            {
                $sort: {
                    reservationTime: 1
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.patient = appointment.patient[0]
            appointment.doctor = appointment.doctor[0]
            appointment.clinic = appointment.clinic[0]
            appointment.service = appointment.service[0]
            /*const todayDate = new Date()

            if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
        })

        return response.status(200).json({
            accepted: true,
            appointments
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getAppointmentsByClinicId = async (request, response) => {

    try {

        const { clinicId } = request.params

        const { searchQuery } = utils
        .statsQueryGenerator('clinicId', clinicId, request.query, 'reservationTime')

        const appointments = await AppointmentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            },
            {
                $sort: {
                    reservationTime: 1
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.patient = appointment.patient[0]
            appointment.doctor = appointment.doctor[0]
            appointment.clinic = appointment.clinic[0]
            appointment.service = appointment.service[0]
            /*const todayDate = new Date()

            if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
        })

        return response.status(200).json({
            accepted: true,
            appointments
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getAppointmentsByPatientId = async (request, response) => {

    try {

        const { patientId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query, 'reservationTime')

        const appointments = await AppointmentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.patient = appointment.patient[0]
            appointment.doctor = appointment.doctor[0]
            appointment.clinic = appointment.clinic[0]
            appointment.service = appointment.service[0]
            /*const todayDate = new Date()

            if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
        })

        return response.status(200).json({
            accepted: true,
            appointments
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getClinicAppointmentsByPatientId = async (request, response) => {

    try {

        const { clinicId, patientId } = request.params

        const { searchQuery } = utils.statsQueryGenerator('patientId', patientId, request.query, 'reservationTime')
        searchQuery.clinicId = mongoose.Types.ObjectId(clinicId)       

        const appointments = await AppointmentModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.patient = appointment.patient[0]
            appointment.doctor = appointment.doctor[0]
            appointment.clinic = appointment.clinic[0]
            appointment.service = appointment.service[0]
            /*const todayDate = new Date()

            if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }*/
        })

        return response.status(200).json({
            accepted: true,
            appointments
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getAppointmentsByClinicIdAndStatus = async (request, response) => {

    try {

        const { clinicId, status } = request.params

        let { searchQuery } = utils
        .statsQueryGenerator('clinicId', clinicId, request.query, 'reservationTime')

        searchQuery.status = status

        const appointments = await AppointmentModel.find(searchQuery)

        return response.status(200).json({
            accepted: true,
            appointments
        })
        
    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getAppointmentsByDoctorIdAndStatus = async (request, response) => {

    try {

        const { userId, status } = request.params

        let { searchQuery } = utils
        .statsQueryGenerator('doctorId', userId, request.query, 'reservationTime')

        searchQuery.status = status

        const appointments = await AppointmentModel.find(searchQuery)

        return response.status(200).json({
            accepted: true,
            appointments
        })
        
    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const updateAppointmentStatus = async (request, response) => {

    try {

        const { appointmentId } = request.params
        const { lang } = request.query
        const { status } = request.body

        const dataValidation = appointmentValidation.updateAppointmentStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const appointment = await AppointmentModel.findById(appointmentId)

        if(appointment.status == status) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Appointment is already in this state'],
                field: 'status'
            })
        }

        /*const todayDate = new Date()
        if(appointment.reservationTime < todayDate) {
            return response.status(400).json({
                accepted: false,
                message: translations[lang]['Appointment date has passed'],
                field: 'reservationDate'
            })
        }*/

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { status }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Updated appointment status successfully!'],
            appointment: updatedAppointment
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const deleteAppointment = async (request, response) => {

    try {

        const { lang } = request.query
        const { appointmentId } = request.params

        const deletedAppointment = await AppointmentModel.findByIdAndDelete(appointmentId)

        return response.status(200).json({
            accepted: true,
            message: translations[lang]['Deleted appointment successfully!'],
            appointment: deletedAppointment
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const sendAppointmentReminder = async (request, response) => {

    try {

        const { appointmentId } = request.params

        const appointment = await AppointmentModel.findById(appointmentId)

        const { patientId, clinicId } = appointment

        const patientPromise = PatientModel.findById(patientId)
        const clinicPromise = ClinicModel.findById(clinicId)

        const [patient, clinic] = await Promise.all([patientPromise, clinicPromise])

        if(!clinic.phone) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['Clinic phone number is not registered'],
                field: 'appointmentId'
            })
        }

        const patientPhone = `${patient.countryCode}${patient.phone}`

        const messageBody = {
            patientName: `${patient.firstName} ${patient.lastName}`,
            appointmentDate: format(new Date(appointment.reservationTime), 'yyyy/MM/dd'),
            appointmentTime: format(new Date(appointment.reservationTime), 'HH:mm a'),
            clinicName: clinic.name,
            clinicPhone: `${clinic.countryCode}${clinic.phone}`,
        }
        

        const messageSent = await whatsappAppointmentReminder.sendAppointmentReminder(patientPhone, 'ar', messageBody)

        if(!messageSent.isSent) {
            return response.status(400).json({
                accepted: false,
                message: translations[request.query.lang]['There was a problem sending the message'],
                field: 'appointmentId'
            })
        }

        return response.status(200).json({
            accepted: true,
            message: 'Reminder sent successfully!',
            appointment
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

const getFollowupRegisteredClinicsAppointments = async (request, response) => {

    try {

        const subscriptionList = await ClinicSubscriptionModel
        .find({ isActive: true, endDate: { $gt: Date.now() } })

        const clinicsIds = subscriptionList.map(subscription => subscription.clinicId)
        
        const uniqueClinicIdsSet = new Set(clinicsIds)
        const uniqueClinicIdsList = [...uniqueClinicIdsSet]

        const appointments = await AppointmentModel.aggregate([
            {
                $match: {
                    clinicId: { $in: uniqueClinicIdsList }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $lookup: {
                    from: 'clinics',
                    localField: 'clinicId',
                    foreignField: '_id',
                    as: 'clinic'
                }
            },
            {
                $project: {
                    'doctor.password': 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.patient = appointment.patient[0]
            appointment.doctor = appointment.doctor[0]
            appointment.clinic = appointment.clinic[0]
            appointment.service = appointment.service[0]
            const todayDate = new Date()

            if(todayDate > appointment.reservationTime && appointment.status != 'CANCELLED') {
                appointment.status = 'EXPIRED'
            }
        })
        

        return response.status(200).json({
            accepted: true,
            appointments
        })

    } catch(error) {
        console.error(error)
        return response.status(400).json({
            accepted: false,
            message: 'internal server error',
            error: error.message
        })
    }
}

module.exports = { 
    addAppointment, 
    getAppointmentsByDoctorId, 
    getAppointmentsByClinicId,
    getAppointmentsByPatientId,
    getClinicAppointmentsByPatientId,
    getAppointmentsByClinicIdAndStatus,
    getAppointmentsByDoctorIdAndStatus,
    updateAppointmentStatus, 
    deleteAppointment,
    sendAppointmentReminder,
    getFollowupRegisteredClinicsAppointments
}