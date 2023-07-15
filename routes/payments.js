const router = require('express').Router()
const paymentsController = require('../controllers/payments')

router.post(
    '/v1/payments/paymob/process', 
    (request, response) => paymentsController.processPayment(request, response)
)

module.exports = router