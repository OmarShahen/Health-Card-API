const config = require('../config/config')
const { concatenateHmacString } = require('../utils/utils')
const crypto = require('crypto')

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

        console.log('payment is successfull!')

        return response.status(200).json({
            accepted: true,
            message: 'processed payment successfully!'
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

module.exports = { processPayment }