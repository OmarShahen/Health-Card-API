const config = require('../config/config')
const { concatenateHmacString } = require('../utils/utils')
const crypto = require('crypto')
const UserModel = require('../models/UserModel')
const SubscriptionModel = require('../models/SubscriptionModel')
const ClinicModel = require('../models/ClinicModel')
const PaymentModel = require('../models/PaymentModel')
const CounterModel = require('../models/CounterModel')
const paymentValidation = require('../validations/payments')
const axios = require('axios')


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

        const billingData = payment.payment_key_claims.billing_data
        const items = payment.order.items


        const userList = await UserModel.find({ email: billingData.email, isVerified: true })
        const user = userList[0]

        if(items.length == 0) {
            return response.status(400).json({
                accepted: false,
                message: 'no item is registered in the order',
                field: 'payment.order.items'
            })
        }

        const item = items[0]

        const subscriptionStartDate = new Date()
        const tempDate = new Date()
        const subscriptionEndDate = new Date(tempDate.setDate(tempDate.getDate() + item.quantity))

        const subscriptionData = {
            startDate: subscriptionStartDate,
            endDate: subscriptionEndDate,
            clinicId: item.description,
            planName: item.name,
            planDurationInDays: item.quantity
        }

        const subscriptionObj = new SubscriptionModel(subscriptionData)
        const newSubscription = await subscriptionObj.save()

        const counter = await CounterModel.findOneAndUpdate(
            { name: 'payment' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        )

        const paymentData = {
            paymentId: counter.value,
            subscriptionId: newSubscription._id,
            transactionId: payment.id,
            success: payment.success,
            pending: payment.pending,
            gateway: 'PAYMOB',
            orderId: payment.order.id,
            amountCents: payment.amount_cents,
            currency: payment.currency,
            userId: user._id,
            createdAt: payment.created_at,
            firstName: payment.payment_key_claims.billing_data.first_name,
            lastName: payment.payment_key_claims.billing_data.last_name,
            email: payment.payment_key_claims.billing_data.email,
            phoneNumber: payment.payment_key_claims.billing_data.phone_number,
        }

        const paymentObj = new PaymentModel(paymentData)
        const newPayment = await paymentObj.save()

        const updateClinicData = { activeUntilDate: newSubscription.endDate, mode: 'PRODUCTION' }
        const updatedClinic = await ClinicModel
        .findByIdAndUpdate(newSubscription.clinicId, updateClinicData, { new: true })

        return response.status(200).json({
            accepted: true,
            message: 'processed payment successfully!',
            payment: newPayment,
            clinic: updatedClinic,
            subscription: newSubscription
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

        const { clinicId, firstName, lastName, phone, email, planName, planDaysDuration, planPrice } = request.body

        const authData = {
            api_key: config.PAYMOB_API_KEYS
        }

        const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', authData)
        
        const orderData = {
            auth_token: authResponse.data.token,
            delivery_needed: "false",
            amount_cents: `${planPrice}`,
            currency: "EGP",
            items: [{ name: planName, description: clinicId, quantity: planDaysDuration, amount_cents: planPrice }]
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

module.exports = { processPayment, createPaymentURL }