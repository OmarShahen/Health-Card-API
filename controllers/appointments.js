const AppointmentModel = require('../models/AppointmentModel')
const UserModel = require('../models/UserModel')
const appointmentValidation = require('../validations/appointments')
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

        const { doctorId, reservationTime } = request.body

        const todayDate = new Date() 
        if(todayDate > new Date(reservationTime)) {
            return response.status(400).json({
                accepted: false,
                message: 'Reservate time has passed',
                field: 'reservationTime'
            })
        }

        const doctor = await UserModel.findById(doctorId)
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

        const appointmentObj = new AppointmentModel(request.body)
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

        const appointments = await AppointmentModel.aggregate([
            {
                $match: {
                    doctorId: mongoose.Types.ObjectId(userId)
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

module.exports = { addAppointment, getAppointmentsByDoctorId, updateAppointmentStatus, deleteAppointment }