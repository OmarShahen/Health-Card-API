const router = require('express').Router()
const paymentsController = require('../controllers/payments')
const authorization = require('../middlewares/verify-permission')

router.post(
    '/v1/payments/paymob',
    authorization.allPermission,
    (request, response) => paymentsController.createPaymentURL(request, response)
)

router.post(
    '/v1/payments/paymob/process', 
    (request, response) => paymentsController.processPayment(request, response)
)

module.exports = router