const AppointmentModel = require('../models/AppointmentModel')
const UserModel = require('../models/UserModel')
const ServiceModel = require('../models/ServiceModel')
const appointmentValidation = require('../validations/appointments')
const ClinicModel = require('../models/ClinicModel')
const utils = require('../utils/utils')
const { sendAppointmentEmail } = require('../mails/appointment')
const { format } = require('date-fns')

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

        const { 
            clinicId,
            doctorId, 
            serviceId, 
            patientName, 
            patientCountryCode, 
            patientPhone, 
            status, 
            reservationTime,
            isSendMail
        } = request.body

        const todayDate = new Date() 
        if(todayDate > new Date(reservationTime)) {
            return response.status(400).json({
                accepted: false,
                message: 'Reservate time has passed',
                field: 'reservationTime'
            })
        }

        const clinicPromise = ClinicModel.findById(clinicId)
        const serviceListPromise = ServiceModel.find({ _id: serviceId, clinicId })
        const doctorPromise = UserModel.findById(doctorId)

        const [clinic, serviceList, doctor] = await Promise.all([
            clinicPromise,
            serviceListPromise,
            doctorPromise
        ])

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id is not registered',
                field: 'clinicId'
            })
        }

        if(serviceList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'service Id is not registered',
                field: 'serviceId'
            })
        }

        if(!doctor) {
            return response.status(400).json({
                accepted: false,
                message: 'doctor Id is not registered',
                field: 'doctorId'
            })
        }

        const appointment = await AppointmentModel.find({ doctorId, reservationTime })
        if(appointment.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Doctor is already registered in that time',
                field: 'reservationTime'
            })
        }

        const appointmentData = { 
            clinicId,
            doctorId, 
            serviceId, 
            patientName,
            patientCountryCode,
            patientPhone,
            status,
            reservationTime
        }


        const appointmentObj = new AppointmentModel(appointmentData)
        const newAppointment = await appointmentObj.save()

        const mailData = {
            receiverEmail: doctor.email,
            appointmentData: {
                clinicName: clinic.name,
                clinicCity: utils.capitalizeFirstLetter(clinic.city),
                serviceName: serviceList[0].name,
                appointmentDate: format(new Date(newAppointment.reservationTime), 'EEEE, MMMM d, yyyy h:mm a')
            }

        }

        let mailStatus

        if(isSendMail) {
            mailStatus = await sendAppointmentEmail(mailData)
        }

        return response.status(200).json({
            accepted: true,
            message: 'Registered appointment successfully!',
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
                message: 'appointment is already in this state',
                field: 'status'
            })
        }

        const todayDate = new Date()
        if(appointment.reservationTime < todayDate) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment date has passed',
                field: 'reservationDate'
            })
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { status }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Updated appointment status successfully!',
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

        const { appointmentId } = request.params

        const deletedAppointment = await AppointmentModel.findByIdAndDelete(appointmentId)

        return response.status(200).json({
            accepted: true,
            message: 'deleted appointment successfully',
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

module.exports = { addAppointment, getAppointmentsByDoctorId, getAppointmentsByClinicId, updateAppointmentStatus, deleteAppointment }