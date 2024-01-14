const router = require('express').Router()
const paymentsController = require('../controllers/payments')
const authorization = require('../middlewares/verify-permission')
const { verifyAppointmentId } = require('../middlewares/verify-routes-params')


router.post(
    '/v1/payments/paymob',
    authorization.allPermission,
    (request, response) => paymentsController.createPaymentURL(request, response)
)

router.post(
    '/v1/payments/paymob/process', 
    (request, response) => paymentsController.processPayment(request, response)
)

router.get(
    '/v1/payments', 
    authorization.allPermission,
    (request, response) => paymentsController.getPayments(request, response)
)

router.get(
    '/v1/payments/statistics', 
    authorization.allPermission,
    (request, response) => paymentsController.getPaymentsStatistics(request, response)
)

router.post(
    '/v1/payments/refund/appointments/:appointmentId',
    authorization.allPermission,
    verifyAppointmentId,
    (request, response) => paymentsController.refundPayment(request, response)
)

router.post(
    '/v1/payments/full-refund/appointments/:appointmentId',
    authorization.adminAndExpertPermission,
    verifyAppointmentId,
    (request, response) => paymentsController.fullRefundPayment(request, response)
)

module.exports = router