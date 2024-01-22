const AppointmentModel = require('../models/AppointmentModel')
const OpeningTimeModel = require('../models/OpeningTimeModel')
const CounterModel = require('../models/CounterModel')
const UserModel = require('../models/UserModel')
const appointmentValidation = require('../validations/appointments')
const utils = require('../utils/utils')
const whatsappCancelAppointment = require('../APIs/whatsapp/send-cancel-appointment')
const { format } = require('date-fns')
const translations = require('../i18n/index')
const mongoose = require('mongoose')
const config = require('../config/config')
const { videoPlatformRequest } = require('../APIs/100ms/request')
const email = require('../mails/send-email')


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

        let { seekerId, expertId, startTime, duration } = request.body

        const todayDate = new Date() 
        if(todayDate > new Date(startTime)) {
            return response.status(400).json({
                accepted: false,
                message: 'Start time has passed',
                field: 'startTime'
            })
        }

        const expertListPromise = UserModel.find({ _id: expertId, type: 'EXPERT' })
        const seekerListPromise = UserModel.find({ _id: seekerId })

        const [expertList, seekerList] = await Promise.all([
            expertListPromise,
            seekerListPromise,
        ])

        if(expertList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert Id is not registered',
                field: 'expertId'
            })
        }

        if(seekerList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Seeker Id is not registered',
                field: 'seekerId'
            })
        }

        if(duration > 60) {
            return response.status(400).json({
                accepted: false,
                message: 'Duration limit is 60 minutes',
                field: 'duration'
            })
        }

        const expert = expertList[0]
        const seeker = seekerList[0]

        startTime = new Date(startTime)
        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + duration)

        request.body.endTime = endTime

        const weekDay = config.WEEK_DAYS[startTime.getDay()]
        const startingHour = startTime.getHours()
        const startingMinute = startTime.getMinutes()

        const openingTimes = await OpeningTimeModel.find({
            expertId,
            weekday: weekDay,
            isActive: true,
        })

        if(openingTimes.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'This day is not available in the schedule',
                field: 'startTime'
            })
        }

        /*const openingTime = openingTimes[0]

        const combinedAvailableOpeningTime = (openingTime.openingTime.hour * 60) + openingTime.openingTime.minute
        const combinedAvailableClosingTime = (openingTime.closingTime.hour * 60) + openingTime.closingTime.minute
        const combinedTargetTime = (startingHour * 60) + startingMinute
        
        if(combinedAvailableOpeningTime > combinedTargetTime || combinedAvailableClosingTime < combinedTargetTime) {
            return response.status(400).json({
                accepted: false,
                message: 'This time slot is not available',
                field: 'startTime'
            })
        }*/

        const existingAppointmentsQuery = {
            expertId,
            isPaid: true,
            status: { $ne: 'CANCELLED' },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $gte: startTime, $lt: endTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        }

        const existingAppointments = await AppointmentModel.find(existingAppointmentsQuery)
        if(existingAppointments.length != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'There is appointment reserved at that time',
                field: 'startTime'
            })
        }

        const roomData = {
            template_id: config.VIDEO_PLATFORM.TEMPLATE_ID,
            description: `${duration} minutes session with ${expert.firstName}`,
            max_duration_seconds: (duration + 5) * 60
        }
        const newRoom = await videoPlatformRequest.post('/v2/rooms', roomData)

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'Appointment' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const appointmentData = { 
            appointmentId: counter.value,
            roomId: newRoom.data.id,
            ...request.body 
        }

        const appointmentObj = new AppointmentModel(appointmentData)
        const newAppointment = await appointmentObj.save()

        const updatedUser = await UserModel
        .findByIdAndUpdate(expert._id, { totalAppointments: expert.totalAppointments + 1 }, { new: true })

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
        }

        const appointmentStartTime = new Date(newAppointment.startTime)
        const appointmentEndTime = new Date(newAppointment.endTime)

        const newUserEmailData = {
            receiverEmail: config.NOTIFICATION_EMAIL,
            subject: 'New Appointment',
            mailBodyText: `You have a new appointment with ID #${newAppointment.appointmentId}`,
            mailBodyHTML: `
            <strong>ID: </strong><span>#${newAppointment.appointmentId}</span><br />
            <strong>Expert: </strong><span>${expert.firstName}</span><br />
            <strong>Seeker: </strong><span>${seeker.firstName}</span><br />
            <strong>Price: </strong><span>${newAppointment.price} EGP</span><br />
            <strong>Duration: </strong><span>${newAppointment.duration} minutes</span><br />
            <strong>Date: </strong><span>${format(newAppointment.startTime, 'dd MMM yyyy')}</span><br />
            <strong>Start Time: </strong><span>${appointmentStartTime.toLocaleString('en-US', options)}</span><br />
            <strong>End Time: </strong><span>${appointmentEndTime.toLocaleString('en-US', options)}</span><br />
            `
        }

        const emailSent = await email.sendEmail(newUserEmailData)

        return response.status(200).json({
            accepted: true,
            message: 'Appointment is booked successfully!',
            appointment: newAppointment,
            expert: updatedUser,
            emailSent
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

const getPaidAppointmentsByExpertIdAndStatus = async (request, response) => {

    try {

        const { userId, status } = request.params

        const matchQuery = { expertId: mongoose.Types.ObjectId(userId), isPaid: true }

        if(status === 'UPCOMING') {
            matchQuery.startTime = { $gte: new Date() }
        }

        if(status === 'PREVIOUS') {
            matchQuery.startTime = { $lt: new Date() }  
        }

        const appointments = await AppointmentModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: {
                    startTime: 1
                }
            },
            {
                $limit: 25
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'expertId',
                    foreignField: '_id',
                    as: 'expert'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
            },
            {
                $project: {
                    'expert.password': 0,
                    'seeker.password': 0
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.expert = appointment.expert[0]
            appointment.seeker = appointment.seeker[0]
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

const getPaidAppointmentsBySeekerIdAndStatus = async (request, response) => {

    try {

        const { userId, status } = request.params

        const matchQuery = { seekerId: mongoose.Types.ObjectId(userId), isPaid: true }

        if(status === 'UPCOMING') {
            matchQuery.startTime = { $gte: new Date() }
        }

        if(status === 'PREVIOUS') {
            matchQuery.startTime = { $lt: new Date() }  
        }

        const appointments = await AppointmentModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: {
                    startTime: 1
                }
            },
            {
                $limit: 25
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'expertId',
                    foreignField: '_id',
                    as: 'expert'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
            },
            {
                $project: {
                    'expert.password': 0,
                    'seeker.password': 0
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.expert = appointment.expert[0]
            appointment.seeker = appointment.seeker[0]
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
                message: 'Appointment is already in this state',
                field: 'status'
            })
        }

        const todayDate = new Date()
        if(appointment.startTime < todayDate) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment date has passed',
                field: 'startTime'
            })
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { status }, { new: true })

        let notificationMessage

        if(status == 'CANCELLED') {

            const expert = await UserModel
            .findByIdAndUpdate(appointment.expertId, { $inc: { totalAppointments: -1 } }, { new: true })
            const seeker = await UserModel.findById(appointment.seekerId)

            const targetPhone = `${expert.countryCode}${expert.phone}`
            const reservationDateTime = new Date(appointment.startTime)
            const messageBody = {
                expertName: expert.firstName,
                appointmentId: `#${appointment.appointmentId}`,
                appointmentDate: format(reservationDateTime, 'dd MMMM yyyy'),
                appointmentTime: format(reservationDateTime, 'hh:mm a'),
                seekerName: seeker.firstName
            }
    
            const messageSent = await whatsappCancelAppointment.sendCancelAppointment(targetPhone, 'en', messageBody)
    
            notificationMessage = messageSent.isSent ? 'Message is sent successfully!' : 'There was a problem sending your message'
        }

        return response.status(200).json({
            accepted: true,
            message: 'Updated appointment status successfully!',
            appointment: updatedAppointment,
            notificationMessage
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

        const mailData = {
            receiverEmail: 'omarredaelsayedmohamed@gmail.com',
            subject: 'New User Sign Up',
            mailBodyText: 'You have a new user with ID #123',
            mailBodyHTML: `
            <strong>ID: </strong><span>#123</span><br />
            <strong>Name: </strong><span>Omar Reda</span><br />
            <strong>Email: </strong><span>omar@gmail.com</span><br />
            <strong>Phone: </strong><span>+201065630331</span><br />
            <strong>Gender: </strong><span>Male</span><br />
            <strong>Age: </strong><span>20</span><br />
            `
        }

        const emailSent = await email.sendEmail(mailData)

        return response.status(200).json({
            accepted: true,
            message: 'Message sent successfully!',
            emailSent
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

const getAppointment = async (request, response) => {

    try {

        const { appointmentId } = request.params

        const appointmentList = await AppointmentModel.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(appointmentId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'expertId',
                    foreignField: '_id',
                    as: 'expert'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
            },
            {
                $project: {
                    'expert.password': 0,
                    'seeker.password': 0,
                }
            }
        ])

        appointmentList.forEach(appointment => {
            appointment.expert = appointment.expert[0]
            appointment.seeker = appointment.seeker[0]
        })

        const appointment = appointmentList[0]

        return response.status(200).json({
            accepted: true,
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

const getAppointments = async (request, response) => {

    try {

        const { status } = request.query
        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query, 'startTime')

        let matchQuery = { ...searchQuery }

        if(status == 'PAID') {
            matchQuery.isPaid = true
        } else if(status == 'UNPAID') {
            matchQuery.isPaid = false
        }

        const appointments = await AppointmentModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { startTime: -1 }
            },
            {
                $limit: 25
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'expertId',
                    foreignField: '_id',
                    as: 'expert'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'seekerId',
                    foreignField: '_id',
                    as: 'seeker'
                }
            },
            {
                $project: {
                    'expert.password': 0,
                    'seeker.password': 0,
                }
            }
        ])

        appointments.forEach(appointment => {
            appointment.expert = appointment.expert[0]
            appointment.seeker = appointment.seeker[0]
        })

        const totalAppointments = await AppointmentModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalAppointments,
            appointments,
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

const get100msRooms = async (request, response) => {

    try {

        const roomsResponse = await videoPlatformRequest.get('/v2/rooms')

        return response.status(200).json({
            accepted: true,
            rooms: roomsResponse.data.data
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

module.exports = { 
    addAppointment,
    updateAppointmentStatus, 
    deleteAppointment,
    sendAppointmentReminder,
    getAppointment,
    getAppointments,
    getPaidAppointmentsByExpertIdAndStatus,
    getPaidAppointmentsBySeekerIdAndStatus,
    get100msRooms
}