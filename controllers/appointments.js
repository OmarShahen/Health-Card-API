const AppointmentModel = require('../models/AppointmentModel')
const UserModel = require('../models/UserModel')
const appointmentValidation = require('../validations/appointments')
const VisitReasonModel = require('../models/VisitReasonModel')
const ClinicModel = require('../models/ClinicModel')
const mongoose = require('mongoose')
const utils = require('../utils/utils')


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
            visitReasonId, 
            patientName, 
            patientCountryCode, 
            patientPhone, 
            status, 
            reservationTime 
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
        const visitReasonPromise = VisitReasonModel.findById(visitReasonId)
        const doctorPromise = UserModel.findById(doctorId)

        const [clinic, visitReason, doctor] = await Promise.all([
            clinicPromise,
            visitReasonPromise,
            doctorPromise
        ])

        if(!clinic) {
            return response.status(400).json({
                accepted: false,
                message: 'clinic Id is not registered',
                field: 'clinicId'
            })
        }

        if(!visitReason) {
            return response.status(400).json({
                accepted: false,
                message: 'visit reason Id is not registered',
                field: 'visitReasonId'
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
            visitReasonId, 
            patientName,
            patientCountryCode,
            patientPhone,
            status,
            reservationTime
        }
        const appointmentObj = new AppointmentModel(appointmentData)
        const newAppointment = await appointmentObj.save()

        return response.status(200).json({
            accepted: true,
            message: 'Registered appointment successfully!',
            appointment: newAppointment
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
                    from: 'visitreasons',
                    localField: 'visitReasonId',
                    foreignField: '_id',
                    as: 'visitReason'
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
            appointment.visitReason = appointment.visitReason[0]
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
                    from: 'visitreasons',
                    localField: 'visitReasonId',
                    foreignField: '_id',
                    as: 'visitReason'
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
            appointment.visitReason = appointment.visitReason[0]
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
            message: 'Updated appointment status successfully',
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