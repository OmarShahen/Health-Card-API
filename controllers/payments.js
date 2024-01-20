const config = require('../config/config')
const { concatenateHmacString } = require('../utils/utils')
const crypto = require('crypto')
const PaymentModel = require('../models/PaymentModel')
const CounterModel = require('../models/CounterModel')
const paymentValidation = require('../validations/payments')
const axios = require('axios')
const AppointmentModel = require('../models/AppointmentModel')
const UserModel = require('../models/UserModel')
const whatsappClinicAppointment = require('../APIs/whatsapp/send-clinic-appointment')
const whatsappCancelAppointment = require('../APIs/whatsapp/send-cancel-appointment')
const { format } = require('date-fns')
const utils = require('../utils/utils')


const processPayment = async (request, response) => {

    try {

        const payment = request.body.obj
        const paymobHmac = request.query.hmac

        const paymentHmacData = {
            amount_cents: payment.amount_cents,
            created_at: payment.created_at,
            currency: payment.currency,
            error_occured: payment.error_occured,
            has_parent_transaction: payment.has_parent_transaction,
            id: payment.id,
            integration_id: payment.integration_id,
            is_3d_secure: payment.is_3d_secure,
            is_auth: payment.is_auth,
            is_capture: payment.is_capture,
            is_refunded: payment.is_refunded,
            is_standalone_payment: payment.is_standalone_payment,
            is_voided: payment.is_voided,
            order: { id: payment.order.id },
            owner: payment.owner,
            pending: payment.pending,
            source_data: {
                pan: payment.source_data.pan,
                sub_type: payment.source_data.sub_type,
                type: payment.source_data.type
            },
            success: payment.success,
        }

        const concatenatedString = concatenateHmacString(paymentHmacData)
        const hash = crypto.createHmac('sha512', config.PAYMOB_HMAC)
        hash.update(concatenatedString)

        const verifiedPaymentHmac = hash.digest('hex')

        if(paymobHmac != verifiedPaymentHmac) {
            return response.status(400).json({
                accepted: false,
                message: 'invalid payment hmac',
                field: 'hmac'
            })
        }

        if(!payment.success) {
            return response.status(400).json({
                accepted: false,
                message: 'payment is not successful',
                field: 'payment.success'
            })
        }

        const items = payment.order.items

        if(items.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'no item is registered in the order',
                field: 'payment.order.items'
            })
        }

        const item = items[0]
        const appointmentId = item.description

        const appointment = await AppointmentModel.findById(appointmentId)
        if(appointment.isPaid) {
            return response.status(400).json({
                accepted: false,
                message: 'Payment is already paid',
                field: 'isPaid'
            })
        }


        const counter = await CounterModel.findOneAndUpdate(
            { name: 'payment' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const paymentData = {
            paymentId: counter.value,
            appointmentId: appointment._id,
            transactionId: payment.id,
            expertId: appointment.expertId,
            seekerId: appointment.seekerId,
            success: payment.success,
            pending: payment.pending,
            gateway: 'PAYMOB',
            orderId: payment.order.id,
            amountCents: payment.amount_cents,
            currency: payment.currency,
            createdAt: payment.created_at,
            commission: 0.1
        }

        const paymentObj = new PaymentModel(paymentData)
        const newPayment = await paymentObj.save()

        const updateAppointmentData = { paymentId: newPayment._id, isPaid: true }
        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, updateAppointmentData, { new: true })

        let reservationDateTime = new Date(updatedAppointment.startTime)

        const expert = await UserModel.findById(updatedAppointment.expertId)
        const seeker = await UserModel.findById(updatedAppointment.seekerId)

        const targetPhone = `${expert.countryCode}${expert.phone}`

        const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Cairo'
        }

        const messageBody = {
            expertName: expert.firstName,
            appointmentId: `#${updatedAppointment.appointmentId}`,
            appointmentDate: format(reservationDateTime, 'dd MMMM yyyy'),
            appointmentTime: reservationDateTime.toLocaleString('en-US', options),
            duration: `${updatedAppointment.duration} minute`,
            seekerName: seeker.firstName
        }

        await whatsappClinicAppointment.sendClinicAppointment(targetPhone, 'en', messageBody)

        return response.status(200).json({
            accepted: true,
            message: 'processed payment successfully!',
            payment: newPayment,
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

const createPaymentURL = async (request, response) => {

    try {

        const dataValidation = paymentValidation.createPaymentURL(request.body)
        if(!dataValidation.isAccepted) {
            return response.status(400).json({
                accepted: dataValidation.isAccepted,
                message: dataValidation.message,
                field: dataValidation.field
            })
        }

        const { appointmentId, firstName, lastName, phone, email, planName, planPrice } = request.body

        const appointment = await AppointmentModel.findById(appointmentId)
        if(!appointment) {
            return response.status(400).json({
                accepted: false,
                message: 'appointment ID is not registered',
                field: 'appointmentId'
            })
        }

        const authData = {
            api_key: config.PAYMOB_API_KEYS
        }

        const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', authData)
        
        const orderData = {
            auth_token: authResponse.data.token,
            delivery_needed: "false",
            amount_cents: `${planPrice}`,
            currency: "EGP",
            items: [{ name: planName, description: appointmentId, quantity: 1, amount_cents: planPrice }]
        }

        const orderResponse = await axios.post('https://accept.paymob.com/api/ecommerce/orders', orderData)

        const token = authResponse.data.token
        const orderId = orderResponse.data.id

        let paymentData = {
            auth_token: token,
            amount_cents: `${planPrice}`, 
            expiration: 3600, 
            order_id: orderId,
            billing_data: {
                apartment: "NA", 
                email: email, 
                floor: "NA", 
                first_name: firstName, 
                street: "NA", 
                building: "NA", 
                phone_number: phone, 
                shipping_method: "NA", 
                postal_code: "NA", 
                city: "NA", 
                country: "EGYPT", 
                last_name: lastName, 
                state: "NA"
            }, 
            currency: "EGP", 
            integration_id: 3931768
        }

        const paymentRequest = await axios.post('https://accept.paymob.com/api/acceptance/payment_keys', paymentData)
        const paymentToken = paymentRequest.data.token

        iFrameURL = `https://accept.paymob.com/api/acceptance/iframes/767779?payment_token=${paymentToken}`

        return response.status(200).json({
            accepted: true,
            iFrameURL
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

const getPayments = async (request, response) => {

    try {

        const { status } = request.query
        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const matchQuery = { ...searchQuery }

        if(status == 'PAID') {
            matchQuery.isRefunded = false
        } else if(status == 'REFUNDED') {
            matchQuery.isRefunded = true
        }

        const payments = await PaymentModel.aggregate([
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
                $lookup: {
                    from: 'appointments',
                    localField: 'appointmentId',
                    foreignField: '_id',
                    as: 'appointment'
                }
            }
        ])

        payments.forEach(payment => {
            payment.seeker = payment.seeker[0]
            payment.expert = payment.expert[0]
            payment.appointment = payment.appointment[0]
        })

        const totalPayments = await PaymentModel.countDocuments(matchQuery)

        return response.status(200).json({
            accepted: true,
            totalPayments,
            payments
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

const getPaymentsStatistics = async (request, response) => {

    try {

        const { searchQuery } = utils.statsQueryGenerator('none', 0, request.query)

        const matchQuery = { ...searchQuery }

        const totalAmountPaidList = await PaymentModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                  _id: null,
                  total: { $sum: '$amountCents' }
                }
            }
        ])

        const totalAmountPaid = totalAmountPaidList[0].total / 100

        const totalAmountPaidActiveList = await PaymentModel.aggregate([
            {
                $match: { ...matchQuery, isRefunded: false }
            },
            {
                $group: {
                  _id: null,
                  total: { $sum: '$amountCents' }
                }
            }
        ])

        const totalAmountPaidActive = totalAmountPaidActiveList[0].total / 100

        const totalAmountPaidRefundedList = await PaymentModel.aggregate([
            {
                $match: { ...matchQuery, isRefunded: true }
            },
            {
                $group: {
                  _id: null,
                  total: { $sum: '$amountCents' }
                }
            }
        ])

        const totalAmountPaidRefunded = totalAmountPaidRefundedList[0].total / 100

        const totalAmountPaidCommissionList = await PaymentModel.aggregate([
            {
                $match: { ...matchQuery, isRefunded: false }
            },
            {
              $project: {
                commissionAmount: { $multiply: ['$commission', '$amountCents'] },
              }
            },
            {
              $group: {
                _id: null,
                totalCommission: { $sum: '$commissionAmount' }
              }
            }
          ])

        const totalAmountPaidCommission = totalAmountPaidCommissionList[0].total / 100

        return response.status(200).json({
            accepted: true,
            totalAmountPaid,
            totalAmountPaidActive,
            totalAmountPaidRefunded,
            totalAmountPaidCommission,
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

const refundPayment = async (request, response) => {

    try {

        const { appointmentId } = request.params

        const appointment = await AppointmentModel.findById(appointmentId)
        
        if(!appointment.isPaid) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is not paid',
                field: 'appointmentId'
            })
        }

        if(!appointment.paymentId) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment has no payment',
                field: 'appointmentId'
            })
        }

        const payment = await PaymentModel.findById(appointment.paymentId)
        if(payment.isRefunded) {
            return response.status(400).json({
                accepted: false,
                message: 'Payment is already refunded',
                field: 'appointmentId'
            })
        }

        const todayTime = new Date()
        const startTime = new Date(appointment.startTime)

        if(todayTime >= startTime) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment time has passed',
                field: 'appointmentId'
            })
        }

        const hoursDifference = utils.getHoursDifference(startTime, todayTime)

        if(hoursDifference < 3) {
            return response.status(400).json({
                accepted: false,
                message: 'Cannot refund before the session by 3 hours',
                field: 'appointmentId'
            })
        }

        const REFUND_PERCENTAGE = hoursDifference <= 24 && hoursDifference >= 3 ? 0.5 : 1
        const REFUND_AMOUNT = payment.amountCents * REFUND_PERCENTAGE
        
        const authData = { api_key: config.PAYMOB_API_KEYS }

        const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', authData)
        const authToken = authResponse.data.token

        try {

            const refundBodyData = { auth_token: authToken, amount_cents: REFUND_AMOUNT, transaction_id: payment.transactionId }

            await axios.post('https://accept.paymob.com/api/acceptance/void_refund/refund', refundBodyData)

        } catch(error) {
            return response.status(400).json({
                accepted: false,
                message: 'There was a problem refunding, please contact the support team',
                error: error?.response?.data?.message
            })
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { status: 'CANCELLED' }, { new: true })

        const updatedPayment = await PaymentModel
        .findByIdAndUpdate(appointment.paymentId, { isRefunded: true }, { new: true })

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

        const notificationMessage = messageSent.isSent ? 'Message is sent successfully!' : 'There was a problem sending your message'


        return response.status(200).json({
            accepted: true,
            message: 'Appointment is cancelled and refunded successfully!',
            notificationMessage,
            appointment: updatedAppointment,
            payment: updatedPayment,
            expert
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

const fullRefundPayment = async (request, response) => {

    try {

        const { appointmentId } = request.params

        const appointment = await AppointmentModel.findById(appointmentId)
        
        if(!appointment.isPaid) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment is not paid',
                field: 'appointmentId'
            })
        }

        if(!appointment.paymentId) {
            return response.status(400).json({
                accepted: false,
                message: 'Appointment has no payment',
                field: 'appointmentId'
            })
        }

        const payment = await PaymentModel.findById(appointment.paymentId)
        if(payment.isRefunded) {
            return response.status(400).json({
                accepted: false,
                message: 'Payment is already refunded',
                field: 'appointmentId'
            })
        }


        const REFUND_PERCENTAGE = 1
        const REFUND_AMOUNT = payment.amountCents * REFUND_PERCENTAGE
        
        const authData = { api_key: config.PAYMOB_API_KEYS }

        const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', authData)
        const authToken = authResponse.data.token

        try {

            const refundBodyData = { auth_token: authToken, amount_cents: REFUND_AMOUNT, transaction_id: payment.transactionId }

            await axios.post('https://accept.paymob.com/api/acceptance/void_refund/refund', refundBodyData)

        } catch(error) {
            return response.status(400).json({
                accepted: false,
                message: 'There was a problem refunding',
                error: error?.response?.data?.message
            })
        }

        const updatedAppointment = await AppointmentModel
        .findByIdAndUpdate(appointmentId, { status: 'CANCELLED' }, { new: true })

        const updatedPayment = await PaymentModel
        .findByIdAndUpdate(appointment.paymentId, { isRefunded: true }, { new: true })

        const expert = await UserModel
        .findByIdAndUpdate(appointment.expertId, { $inc: { totalAppointments: -1 } }, { new: true })

        const seeker = await UserModel.findById(appointment.seekerId)

        const targetPhone = `${seeker.countryCode}${seeker.phone}`
        const reservationDateTime = new Date(appointment.startTime)
        const messageBody = {
            expertName: seeker.firstName,
            appointmentId: `#${appointment.appointmentId}`,
            appointmentDate: format(reservationDateTime, 'dd MMMM yyyy'),
            appointmentTime: format(reservationDateTime, 'hh:mm a'),
            seekerName: expert.firstName
        }

        const messageSent = await whatsappCancelAppointment.sendCancelAppointment(targetPhone, 'en', messageBody)

        const notificationMessage = messageSent.isSent ? 'Message is sent successfully!' : 'There was a problem sending your message'


        return response.status(200).json({
            accepted: true,
            message: 'Appointment is cancelled and refunded successfully!',
            notificationMessage,
            appointment: updatedAppointment,
            payment: updatedPayment,
            expert
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
    processPayment, 
    createPaymentURL, 
    getPayments, 
    refundPayment,
    fullRefundPayment,
    getPaymentsStatistics
}