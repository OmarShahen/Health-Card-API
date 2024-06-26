const AppointmentModel = require('../models/AppointmentModel')
const OpeningTimeModel = require('../models/OpeningTimeModel')
const CounterModel = require('../models/CounterModel')
const UserModel = require('../models/UserModel')
const ServiceModel = require('../models/ServiceModel')
const PromoCodeModel = require('../models/PromoCodeModel')
const PaymentModel = require('../models/PaymentModel')
const SettingModel = require('../models/SettingModel')
const appointmentValidation = require('../validations/appointments')
const utils = require('../utils/utils')
const whatsappCancelAppointment = require('../APIs/whatsapp/send-cancel-appointment')
const { format } = require('date-fns')
const translations = require('../i18n/index')
const mongoose = require('mongoose')
const config = require('../config/config')
const email = require('../mails/send-email')
const mailTemplates = require('../mails/templates/reminder')
const moment = require('moment')
const meetingLinkTemplate = require('../mails/templates/meeting-link')


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

        let { seekerId, expertId, serviceId, startTime, price, duration, isOnlineBooking } = request.body

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
        const servicePromise = ServiceModel.findById(serviceId)

        const [expertList, seekerList, service] = await Promise.all([
            expertListPromise,
            seekerListPromise,
            servicePromise
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

        if(!service) {
            return response.status(400).json({
                accepted: false,
                message: 'Service ID is not registered',
                field: 'serviceId'
            })
        }

        const expert = expertList[0]
        const seeker = seekerList[0]

        if(expert.isDeactivated) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert is not receiving any appointment now',
                field: 'expertId'
            })
        }

        startTime = new Date(startTime)
        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + duration)

        request.body.endTime = endTime

        if(isOnlineBooking) {

            if(!expert.isOnline) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Expert is not online to book it now',
                    field: 'isOnlineBooking'
                })
            }

        } else {

            const weekDay = config.WEEK_DAYS[startTime.getDay()]

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
        }

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

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'Appointment' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        if(price == 0) {
            request.body.isPaid = true
        }

        if(expert.meetingLink) {
            request.body.meetingLink = expert.meetingLink
        }

        request.body.commission = 0

        if(!expert.isSubscribed) {
            const settingsList = await SettingModel.find()
            const settings = settingsList[0]

            request.body.commission = settings.paymentCommission
        }

        const appointmentData = { 
            appointmentId: counter.value,
            originalPrice: request.body.price,
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
            subject: isOnlineBooking ? 'New Online Appointment' : 'New Appointment',
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

        updatedUser.password = undefined

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

const getAppointmentsByExpertIdAndStatus = async (request, response) => {

    try {

        const { userId, status } = request.params
        const { isPaid } = request.query

        const matchQuery = { expertId: mongoose.Types.ObjectId(userId) }

        if(status === 'UPCOMING') {
            matchQuery.startTime = { $gte: new Date() }
        }

        if(status === 'PREVIOUS') {
            matchQuery.startTime = { $lt: new Date() }  
        }

        if(isPaid == 'TRUE') {
            matchQuery.isPaid = true
        } else if(isPaid == 'FALSE') {
            matchQuery.isPaid = false
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

const getAppointmentsBySeekerIdAndStatus = async (request, response) => {

    try {

        const { userId, status } = request.params

        const matchQuery = { seekerId: mongoose.Types.ObjectId(userId) }

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

const updateAppointmentMeetingLink = async (request, response) => {

    try {

        const { appointmentId } = request.params
        const { meetingLink } = request.body

        const dataValidation = appointmentValidation.updateAppointmentMeetingLink(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        /*const appointmentsCount = await AppointmentModel.countDocuments({ meetingLink })
        if(appointmentsCount != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'This link is registered with another appointment',
                field: 'meetingLink'
            })
        }*/

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { meetingLink }, { new: true })

        const expert = await UserModel.findById(updatedAppointment.expertId)
        const seeker = await UserModel.findById(updatedAppointment.seekerId)

        const dateOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
        }

        const appointmentStartTime = updatedAppointment.startTime

        const formattedDate = format(appointmentStartTime, 'dd MMMM yyyy')
        const formattedTime = appointmentStartTime.toLocaleString('en-US', dateOptions) 
        const formattedDateTime = `${formattedDate} ${formattedTime}`
        
        const expertMailTemplateData = {
            receiverName: expert.firstName,
            startTime: formattedDateTime,
            meetingLink,
            senderName: `RA'AYA`
        }
        const expertMailTemplate = meetingLinkTemplate.meetingLinkTemplate(expertMailTemplateData)
        const expertMailData = {
            receiverEmail: expert.email,
            subject: 'Your Meeting Link',
            mailBodyHTML: expertMailTemplate
        }

        const expertMailSent = await email.sendEmail(expertMailData)

        const seekerMailTemplateData = {
            receiverName: seeker.firstName,
            startTime: formattedDateTime,
            meetingLink,
            senderName: `RA'AYA`
        }
        const seekerMailTemplate = meetingLinkTemplate.meetingLinkTemplate(seekerMailTemplateData)
        const seekerMailData = {
            receiverEmail: seeker.email,
            subject: 'Your Meeting Link',
            mailBodyHTML: seekerMailTemplate
        }

        const seekerMailSent = await email.sendEmail(seekerMailData)

        return response.status(200).json({
            accepted: true,
            message: 'Updated appointment meeting link successfully!',
            expertMailSent,
            seekerMailSent,
            appointment: updatedAppointment,
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

        const expert = await UserModel.findById(appointment.expertId)
        const seeker = await UserModel.findById(appointment.seekerId)

        const dateOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
        }

        const appointmentStartTime = appointment.startTime

        const formattedDate = format(appointmentStartTime, 'dd MMMM yyyy')
        const formattedTime = appointmentStartTime.toLocaleString('en-US', dateOptions) 
        const formattedDateTime = `${formattedDate} ${formattedTime}`

        const expertTemplateData = {
            receiverName: expert.firstName,
            senderName: `RA'AYA`,
            startTime: formattedDateTime
        }

        const expertTemplate = mailTemplates.reminderTemplate(expertTemplateData)
        const expertMailData = {
            receiverEmail: expert.email,
            subject: 'Reminder: Upcoming Appointment',
            mailBodyHTML: expertTemplate
        }

        const expertMailSent = await email.sendEmail(expertMailData)

        const seekerTemplateData = {
            receiverName: seeker.firstName,
            senderName: `RA'AYA`,
            startTime: formattedDateTime
        }

        const seekerTemplate = mailTemplates.reminderTemplate(seekerTemplateData)
        const seekerMailData = {
            receiverEmail: seeker.email,
            subject: 'Reminder: Upcoming Appointment',
            mailBodyHTML: seekerTemplate
        }

        const seekerMailSent = await email.sendEmail(seekerMailData)

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointment._id, { isReminderSent: true }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Reminder is sent successfully!',
            expertMailSent,
            seekerMailSent,
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

const sendAppointmentMeetingLink = async (request, response) => {

    try {

        const { appointmentId } = request.params

        const appointment = await AppointmentModel.findById(appointmentId)

        if(!appointment.meetingLink) {
            return response.status(400).json({
                accepted: false,
                message: 'No meeting link registered yet',
                field: 'appointmentId'
            })
        }

        const expert = await UserModel.findById(appointment.expertId)
        const seeker = await UserModel.findById(appointment.seekerId)

        const dateOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
        }

        const appointmentStartTime = appointment.startTime

        const formattedDate = format(appointmentStartTime, 'dd MMMM yyyy')
        const formattedTime = appointmentStartTime.toLocaleString('en-US', dateOptions) 
        const formattedDateTime = `${formattedDate} ${formattedTime}`
        
        const expertMailTemplateData = {
            receiverName: expert.firstName,
            startTime: formattedDateTime,
            meetingLink: appointment.meetingLink,
            senderName: `RA'AYA`
        }
        const expertMailTemplate = meetingLinkTemplate.meetingLinkTemplate(expertMailTemplateData)
        const expertMailData = {
            receiverEmail: expert.email,
            subject: 'Your Meeting Link',
            mailBodyHTML: expertMailTemplate
        }

        const expertMailSent = await email.sendEmail(expertMailData)

        const seekerMailTemplateData = {
            receiverName: seeker.firstName,
            startTime: formattedDateTime,
            meetingLink: appointment.meetingLink,
            senderName: `RA'AYA`
        }
        const seekerMailTemplate = meetingLinkTemplate.meetingLinkTemplate(seekerMailTemplateData)
        const seekerMailData = {
            receiverEmail: seeker.email,
            subject: 'Your Meeting Link',
            mailBodyHTML: seekerMailTemplate
        }

        const seekerMailSent = await email.sendEmail(seekerMailData)

        return response.status(200).json({
            accepted: true,
            message: 'Sent meeting link successfully!',
            expertMailSent,
            seekerMailSent,
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

const sendReminderForUpcomingAppointments = async (request, response) => {

    try {

        const today = new Date()        

        const startOfDay = new Date()
        const endOfDay = new Date(today.setDate(today.getDate() + 1))

        const appointments = await AppointmentModel.aggregate([
            {
                $match: {
                    isPaid: true,
                    status: { $ne: 'CANCELLED' },
                    isReminderSent: false,
                    startTime: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
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
            }
        ])

        let total = 0

        try {

            appointments.forEach(appointment => {
                appointment.seeker = appointment.seeker[0]
                appointment.expert = appointment.expert[0]
            })
            
            for(const appointment of appointments) {

                const dateOptions = {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'Africa/Cairo'
                }

                const appointmentStartTime = appointment.startTime

                const formattedDate = format(appointmentStartTime, 'dd MMMM yyyy')
                const formattedTime = appointmentStartTime.toLocaleString('en-US', dateOptions) 
                const formattedDateTime = `${formattedDate} ${formattedTime}`


                const expertTemplateData = {
                    receiverName: appointment.expert.firstName,
                    senderName: `RA'AYA`,
                    startTime: formattedDateTime
                }

                const expertMailData = {
                    receiverEmail: appointment.expert.email,
                    subject: 'Reminder: Upcoming Appointment',
                    mailBodyHTML: mailTemplates.reminderTemplate(expertTemplateData)
                }

                await email.sendEmail(expertMailData)   

                const seekerTemplateData = {
                    receiverName: appointment.seeker.firstName,
                    senderName: `RA'AYA`,
                    startTime: formattedDateTime
                }

                const seekerMailData = {
                    receiverEmail: appointment.seeker.email,
                    subject: 'Reminder: Upcoming Appointment',
                    mailBodyHTML: mailTemplates.reminderTemplate(seekerTemplateData)
                }

                await email.sendEmail(seekerMailData)

                await AppointmentModel.findByIdAndUpdate(appointment._id, { isReminderSent: true })

                total++

            }

        } catch(error) {
            console.error(error)
        }


        return response.status(200).json({
            accepted: true,
            message: 'Reminders is sent successfully!',
            total
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
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $lookup: {
                    from: 'promocodes',
                    localField: 'promoCodeId',
                    foreignField: '_id',
                    as: 'promoCode'
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
            appointment.service = appointment.service[0]
            appointment.promoCode = appointment.promoCode[0]
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

        const { status, meetingLink, verification, isOnlineBooking } = request.query
        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query, 'startTime')

        let matchQuery = { ...searchQuery }

        if(verification) {
            matchQuery.verification = verification
        }

        if(status == 'PAID') {
            matchQuery.isPaid = true
        } else if(status == 'UNPAID') {
            matchQuery.isPaid = false
        }

        if(meetingLink == 'TRUE') {
            matchQuery.meetingLink = { $exists: true }
        } else if(meetingLink == 'FALSE') {
            matchQuery.meetingLink = { $exists: false }
        }

        if(isOnlineBooking == 'TRUE') {
            matchQuery.isOnlineBooking = true
        } else if(isOnlineBooking == 'FALSE') {
            matchQuery.isOnlineBooking = false
        }

        const appointments = await AppointmentModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { createdAt: -1 }
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

const getAppointmentsByExpertId = async (request, response) => {

    try {

        const { userId } = request.params
        const { status, meetingLink, isOnlineBooking } = request.query
        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query, 'startTime')

        let matchQuery = { ...searchQuery, expertId: mongoose.Types.ObjectId(userId) }

        if(status == 'PAID') {
            matchQuery.isPaid = true
        } else if(status == 'UNPAID') {
            matchQuery.isPaid = false
        } else if(status == 'CANCELLED') {
            matchQuery.status = 'CANCELLED'
        }

        if(meetingLink == 'TRUE') {
            matchQuery.meetingLink = { $exists: true }
        } else if(meetingLink == 'FALSE') {
            matchQuery.meetingLink = { $exists: false }
        }

        if(isOnlineBooking == 'TRUE') {
            matchQuery.isOnlineBooking = true
        } else if(isOnlineBooking == 'FALSE') {
            matchQuery.isOnlineBooking = false
        }

        const appointments = await AppointmentModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $sort: { createdAt: -1 }
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

const getAppointmentsStats = async (request, response) => {

    try {

        const totalAppointments = await AppointmentModel.countDocuments()
        const totalAppointmentsWithoutLink = await AppointmentModel.countDocuments({ meetingLink: { $exists: false } })
        const totalAppointmentsNotPaid = await AppointmentModel.countDocuments({ isPaid: false })
        const totalAppointmentsPaid = await AppointmentModel.countDocuments({ isPaid: true })
        
        const todayDate = new Date()

        const totalUpcomingAppointments = await AppointmentModel
        .countDocuments({ startTime: { $gte: todayDate }, isPaid: true, status: { $ne: 'CANCELLED' } })
        
        const totalPassedAppointments = await AppointmentModel
        .countDocuments({ startTime: { $lt: todayDate }, isPaid: true, status: { $ne: 'CANCELLED' } })

        const totalAppointmentsReminderSent = await AppointmentModel
        .countDocuments({ isReminderSent: true, isPaid: true, status: { $ne: 'CANCELLED' } })

        const totalAppointmentsReminderNotSent = await AppointmentModel
        .countDocuments({ isReminderSent: false, isPaid: true, status: { $ne: 'CANCELLED' } })

        const startOfDay = moment(todayDate).startOf('day').toDate()
        const endOfDay = moment(todayDate).endOf('day').toDate()

        const totalTodayAppointments = await AppointmentModel.countDocuments({
            isPaid: true,
            status: { $ne: 'CANCELLED' },
            startTime: {
                $gte: startOfDay,
                $lt: endOfDay
            },
        })

        return response.status(200).json({
            accepted: true,
            totalAppointments,
            totalAppointmentsWithoutLink,
            totalAppointmentsPaid,
            totalAppointmentsNotPaid,
            totalUpcomingAppointments,
            totalPassedAppointments,
            totalTodayAppointments,
            totalAppointmentsReminderSent,
            totalAppointmentsReminderNotSent
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

const getAppointmentsStatsByExpertId = async (request, response) => {

    try {

        const { userId } = request.params
        const expertId = mongoose.Types.ObjectId(userId)

        const totalAppointments = await AppointmentModel.countDocuments({ expertId })
        const totalAppointmentsWithoutLink = await AppointmentModel.countDocuments({ expertId, meetingLink: { $exists: false }, isPaid: true })
        const totalAppointmentsNotPaid = await AppointmentModel.countDocuments({ expertId, isPaid: false })
        const totalAppointmentsPaid = await AppointmentModel.countDocuments({ expertId, isPaid: true })
        const totalAppointmentsCancelled = await AppointmentModel.countDocuments({ expertId, status: 'CANCELLED', isPaid: true })
        
        const todayDate = new Date()

        const totalUpcomingAppointments = await AppointmentModel
        .countDocuments({ expertId, startTime: { $gte: todayDate }, isPaid: true, status: { $ne: 'CANCELLED' } })
        
        const totalPassedAppointments = await AppointmentModel
        .countDocuments({ expertId, startTime: { $lt: todayDate }, isPaid: true, status: { $ne: 'CANCELLED' } })

        const startOfDay = moment(todayDate).startOf('day').toDate()
        const endOfDay = moment(todayDate).endOf('day').toDate()

        const totalTodayAppointments = await AppointmentModel.countDocuments({
            expertId,
            isPaid: true,
            status: { $ne: 'CANCELLED' },
            startTime: {
                $gte: startOfDay,
                $lt: endOfDay
            },
        })

        return response.status(200).json({
            accepted: true,
            totalAppointments,
            totalAppointmentsWithoutLink,
            totalAppointmentsPaid,
            totalAppointmentsNotPaid,
            totalUpcomingAppointments,
            totalPassedAppointments,
            totalTodayAppointments,
            totalAppointmentsCancelled
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

const getAppointmentsGrowthStats = async (request, response) => {

    try {

        const { groupBy } = request.query

        let format = '%Y-%m-%d'

        if(groupBy == 'MONTH') {
            format = '%Y-%m'
        } else if(groupBy == 'YEAR') {
            format = '%Y'
        }

        const appointmentsGrowth = await AppointmentModel.aggregate([
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: format,
                    date: '$createdAt',
                  },
                },
                count: { $sum: 1 },
              },
            },
            {
              $sort: {
                '_id': 1,
              },
            },
        ])

        return response.status(200).json({
            accepted: true,
            appointmentsGrowth
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

const updateAppointmentPaymentVerification = async (request, response) => {

    try {

        const dataValidation = appointmentValidation.updateAppointmentPaymentVerification(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { appointmentId } = request.params
        const { transactionId, gateway } = request.body

        const appointment = await AppointmentModel.findById(appointmentId)
        if(appointment.verification && appointment.verification != 'REVIEW') {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is not in review mode!',
                field: 'appointmentId'
            })
        }

        const matchQuery = { verification: 'ACCEPTED', payment: { transactionId, gateway } }
        const appointmentsCount = await AppointmentModel.countDocuments(matchQuery)

        if(appointmentsCount != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Transaction ID is already registered',
                field: 'transactionId'
            })
        }

        const paymentVerificationData = {
            verification: 'REVIEW',
            payment: { transactionId, gateway: gateway.toUpperCase() }
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, paymentVerificationData, { new: true })

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
        }

        const appointmentStartTime = new Date(updatedAppointment.startTime)
        const appointmentEndTime = new Date(updatedAppointment.endTime)

        const seeker = await UserModel.findById(updatedAppointment.seekerId)
        const expert = await UserModel.findById(updatedAppointment.expertId)

        const emailDataList = [
            { field: 'ID', data: `#${updatedAppointment.appointmentId}` },
            { field: 'Expert', data: expert.firstName },
            { field: 'Seeker', data: seeker.firstName },
            { field: 'Transaction ID', data: transactionId },
            { field: 'Gateway', data: gateway.toLowerCase() },
            { field: 'Price', data: updatedAppointment.price },
            { field: 'Duration', data: updatedAppointment.duration },
            { field: 'Date', data: format(updatedAppointment.startTime, 'dd MMM yyyy') },
            { field: 'Start Time', data: appointmentStartTime.toLocaleString('en-US', options) },
            { field: 'End Time', data: appointmentEndTime.toLocaleString('en-US', options) },
        ]

        const newAppointmentPaymentData = {
            receiverEmail: config.NOTIFICATION_EMAIL,
            subject: 'New Appointment Payment Verification',
            mailBodyText: `You have a new appointment payment with ID #${updatedAppointment.appointmentId} to verify`,
            mailBodyHTML: emailTemplates.createListMessage(emailDataList)
        }

        const emailSent = await email.sendEmail(newAppointmentPaymentData)

        return response.status(200).json({
            accepted: true,
            message: 'Updated appointment payment verification data!',
            emailSent,
            appointment: updatedAppointment,
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

const updateAppointmentVerificationStatus = async (request, response) => {

    try {

        const dataValidation = appointmentValidation.updateAppointmentVerification(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { appointmentId } = request.params
        const { verification } = request.body

        const appointment = await AppointmentModel.findById(appointmentId)

        if(!appointment.payment || !appointment.payment.transactionId || !appointment.payment.gateway) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment payment verification data is missing',
                field: 'appointmentId'
            })
        }

        if(appointment.verification == verification) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment verification is already in this status',
                field: 'verification'
            })
        }

        let newPayment
        let updatedAppointment
        let updatedPayment

        const seeker = await UserModel.findById(appointment.seekerId)
        const expert = await UserModel.findById(appointment.expertId)

        if(verification == 'ACCEPTED') {

            const counter = await CounterModel.findOneAndUpdate(
                { name: 'payment' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            )
            
            const paymentData = {
                paymentId: counter.value,
                appointmentId: appointment._id,
                expertId: appointment.expertId,
                seekerId: appointment.seekerId,
                transactionId: appointment.payment.transactionId,
                success: true,
                pending: false,
                gateway: appointment.payment.gateway,
                method: 'MANUAL',
                amountCents: appointment.price * 100,
                commission: config.PAYMENT_COMMISSION
            }

            const paymentObj = new PaymentModel(paymentData)
            newPayment = await paymentObj.save()

            const updateAppointmentData = {
                verification,
                isPaid: true,
                paymentId: newPayment._id
            }

            updatedAppointment = await AppointmentModel
            .findByIdAndUpdate(appointmentId, updateAppointmentData, { new: true })

            const appointmentStartTime = new Date(updatedAppointment.startTime)

            const options = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Africa/Cairo'
            }

            const seekerEmailData = {
                seekerName: seeker.firstName,
                expertName: expert.firstName,
                appointmentDate: format(updatedAppointment.startTime, 'dd MMM yyyy'),
                appointmentTime: appointmentStartTime.toLocaleString('en-US', options)
            }

            const seekerAppointmentVerificationData = {
                receiverEmail: seeker.email,
                subject: 'Payment Accepted - Your Appointment is Confirmed!',
                mailBodyText: `Your appointment is confirmed!`,
                mailBodyHTML: emailTemplates.getAppointmentAcceptancePaymentVerification(seekerEmailData)
            }

            const expertEmailData = {
                expertName: expert.firstName,
                link: "https://ra-aya.web.app/appointments/status/upcoming"
            }

            const expertAppointmentVerificationData = {
                receiverEmail: expert.email,
                subject: 'New Appointment - Action Required',
                mailBodyText: `You got a new appointment!`,
                mailBodyHTML: emailTemplates.getExpertNewAppointmentMessage(expertEmailData)
            }

            await Promise.all([
                email.sendEmail(seekerAppointmentVerificationData),
                email.sendEmail(expertAppointmentVerificationData)  
            ])

        } else if(verification == 'REVIEW' || verification == 'REJECTED') {
            
            const updateAppointmentData = { verification, isPaid: false }
            const updatePaymentData = { success: false }

            updatedPayment = await PaymentModel
            .findByIdAndUpdate(appointment.paymentId, updatePaymentData, { new: true })

            updatedAppointment = await AppointmentModel
            .findByIdAndUpdate(appointmentId, updateAppointmentData, { new: true })

            if(verification == 'REJECTED') {

                const appointmentStartTime = new Date(updatedAppointment.startTime)

                const options = {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: 'Africa/Cairo'
                }

                const seekerEmailData = {
                    seekerName: seeker.firstName,
                    expertName: expert.firstName,
                    appointmentDate: format(updatedAppointment.startTime, 'dd MMM yyyy'),
                    appointmentTime: appointmentStartTime.toLocaleString('en-US', options)
                }

                const seekerAppointmentVerificationData = {
                    receiverEmail: seeker.email,
                    subject: 'Payment Rejected - Action Required',
                    mailBodyText: `Your payment is rejected!`,
                    mailBodyHTML: emailTemplates.getAppointmentRejectionPaymentVerification(seekerEmailData)
                }

                const expertEmailData = {
                    expertName: expert.firstName,
                    seekerName: seeker.firstName,
                    appointmentId: `#${updatedAppointment.appointmentId}`
                }

                const expertAppointmentVerificationData = {
                    receiverEmail: expert.email,
                    subject: 'Appointment Update - Cancellation',
                    mailBodyText: `You got a cancelled appointment!`,
                    mailBodyHTML: emailTemplates.getExpertCancelledAppointmentMessage(expertEmailData)
                }

                await Promise.all([
                    email.sendEmail(seekerAppointmentVerificationData),
                    email.sendEmail(expertAppointmentVerificationData)  
                ])
            }
        }

        return response.status(200).json({
            accepted: true,
            message: 'Updated appointment verification successfully!',
            appointment: updatedAppointment,
            payment: newPayment,
            updatedPayment
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

const searchAppointmentsByExpertAndSeekerName = async (request, response) => {

    try {

        const { name } = request.query

        if(!name) {
            return response.status(400).json({
                accepted: false,
                message: 'No name to search for',
                field: 'name'
            })
        }

        const appointments = await AppointmentModel.aggregate([
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
                $match: {
                  $or: [
                    { 'expert.firstName': { $regex: new RegExp(name, 'i') } },
                    { 'seeker.firstName': { $regex: new RegExp(name, 'i') } },
                  ],
                }
            },
            {
                $limit: 25
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

        return response.status(200).json({
            accepted: true,
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

const searchAppointmentsByExpertIdAndSeekerName = async (request, response) => {

    try {

        const { userId } = request.params
        const { name } = request.query

        if(!name) {
            return response.status(400).json({
                accepted: false,
                message: 'No name to search for',
                field: 'name'
            })
        }

        const appointments = await AppointmentModel.aggregate([
            {
                $match: { expertId: mongoose.Types.ObjectId(userId) }
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
                $match: {
                  $or: [
                    { 'seeker.firstName': { $regex: new RegExp(name, 'i') } },
                  ],
                }
            },
            {
                $limit: 25
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

        return response.status(200).json({
            accepted: true,
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

const applyAppointmentPromoCode = async (request, response) => {

    try {

        const dataValidation = appointmentValidation.applyAppointmentPromoCode(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { appointmentId } = request.params
        const { promoCode } = request.body

        const promoCodesList = await PromoCodeModel.find({ code: promoCode })
        if(promoCodesList.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Promo code is not registered',
                field: 'promoCode'
            })
        }

        const targetPromoCode = promoCodesList[0]
        
        if(!targetPromoCode.isActive) {
            return response.status(400).json({
                accepted: false,
                message: 'Promo code is not active',
                field: 'promoCode'
            })
        }
        
        if(targetPromoCode.maxUsage != 0) {
            const totalPromoCodeAppointments = await AppointmentModel.countDocuments({ promoCodeId: targetPromoCode._id })
            if(totalPromoCodeAppointments >= targetPromoCode.maxUsage) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Promo code has passed the max usage',
                    field: 'promoCode'
                })
            }
        }

        if(targetPromoCode.expirationDate) {
            const todayDate = new Date()
            const expirationDate = new Date(targetPromoCode.expirationDate)

            if(todayDate > expirationDate) {
                return response.status(400).json({
                    accepted: false,
                    message: 'Promo code has expired',
                    field: 'promoCode'
                })
            }
        }

        const appointment = await AppointmentModel.findById(appointmentId)
        const expertId = appointment.expertId
        const seekerId = appointment.seekerId

        if(appointment.isPaid) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is already paid',
                field: 'promoCode'
            })
        }

        if(appointment.promoCodeId) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is registered with another promo code',
                field: 'promoCode'
            })
        }

        const totalSeekerAppointments = await AppointmentModel
        .countDocuments({ seekerId, promoCodeId: targetPromoCode._id, isPaid: true })

        if(totalSeekerAppointments >= targetPromoCode.userMaxUsage) {
            return response.status(400).json({
                accepted: false,
                message: 'Promo code has passed the user maximum usage',
                field: 'promoCode'
            })
        }
        
        const expert = await UserModel.findById(expertId)
        if(!expert.isAcceptPromoCodes) {
            return response.status(400).json({
                accepted: false,
                message: 'Expert does not accept promo codes',
                field: 'promoCode'
            })
        }

        const DEDUCTION_AMOUNT = appointment.price * targetPromoCode.percentage
        const NEW_PRICE = appointment.price - DEDUCTION_AMOUNT

        const updateAppointmentData = {
            price: NEW_PRICE,
            promoCodeId: targetPromoCode._id,
            discountPercentage: targetPromoCode.percentage
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, updateAppointmentData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Applied Promo code successfully!',
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

const removeAppointmentPromoCode = async (request, response) => {

    try {

        const { appointmentId } = request.params

        const appointment = await AppointmentModel.findById(appointmentId)

        if(appointment.isPaid) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is already paid',
                field: 'promoCode'
            })
        }

        const updateAppointmentData = {
            price: appointment.originalPrice,
            promoCodeId: null,
            discountPercentage: null
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, updateAppointmentData, { new: true })


        return response.status(200).json({
            accepted: true,
            message: 'Removed Promo code successfully!',
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

const cancelFreeSession = async (request, response) => {

    try {

        const { appointmentId } = request.params

        const appointment = await AppointmentModel.findById(appointmentId)

        if(appointment.status == 'CANCELLED') {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is already cancelled',
                field: 'appointmentId'
            })
        }

        if(appointment.paymentId) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is registered with payment',
                field: 'appointmentId'
            })
        }

        if(appointment.price != 0) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is not free to be cancelled',
                field: 'appointmentId'
            })
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { status: 'CANCELLED' }, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'Cancelled appointment successfully!',
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

const updateAppointmentPaymentStatus = async (request, response) => {

    try {

        const dataValidation = appointmentValidation.updateAppointmentPaymentStatus(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { appointmentId } = request.params
        const { isPaid } = request.body

        const appointment = await AppointmentModel.findById(appointmentId)

        if(appointment.status == 'CANCELLED') {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is already cancelled',
                field: 'appointmentId'
            })
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { isPaid }, { new: true })

        let seekerMailSent

        if(isPaid) {

            const seeker = await UserModel.findById(updatedAppointment.seekerId)

            const dateOptions = {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'Africa/Cairo'
            }

            const appointmentStartTime = updatedAppointment.startTime

            const formattedDate = format(appointmentStartTime, 'dd MMMM yyyy')
            const formattedTime = appointmentStartTime.toLocaleString('en-US', dateOptions) 
            const formattedDateTime = `${formattedDate} ${formattedTime}`
                    
            const seekerMailTemplateData = {
                receiverName: seeker.firstName,
                startTime: formattedDateTime,
                meetingLink: updatedAppointment.meetingLink,
                senderName: `RA'AYA`
            }
            const seekerMailTemplate = meetingLinkTemplate.meetingLinkTemplate(seekerMailTemplateData)
            const seekerMailData = {
                receiverEmail: seeker.email,
                subject: 'Your Meeting Link',
                mailBodyHTML: seekerMailTemplate
            }

            seekerMailSent = await email.sendEmail(seekerMailData)
        }

        return response.status(200).json({
            accepted: true,
            message: 'Updated appointment payment status successfully!',
            seekerMailSent,
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


module.exports = { 
    addAppointment,
    updateAppointmentStatus, 
    updateAppointmentMeetingLink,
    deleteAppointment,
    sendAppointmentReminder,
    sendAppointmentMeetingLink,
    sendReminderForUpcomingAppointments,
    getAppointment,
    getAppointments,
    getAppointmentsByExpertId,
    getAppointmentsByExpertIdAndStatus,
    getAppointmentsBySeekerIdAndStatus,
    getAppointmentsStats,
    getAppointmentsStatsByExpertId,
    getAppointmentsGrowthStats,
    updateAppointmentPaymentVerification,
    updateAppointmentVerificationStatus,
    searchAppointmentsByExpertAndSeekerName,
    searchAppointmentsByExpertIdAndSeekerName,
    applyAppointmentPromoCode,
    removeAppointmentPromoCode,
    cancelFreeSession,
    updateAppointmentPaymentStatus
}