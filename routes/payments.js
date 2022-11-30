const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const paymentsController = require('../controllers/payments')

router.post(
    '/payments/clubs/:clubId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.addPayment(request, response)
)

router.get(
    '/payments/clubs/:clubId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.getPayments(request, response)
)

router.delete(
    '/payments/:paymentId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyPaymentId,
    (request, response) => paymentsController.deletePayment(request, response)
)

router.put(
    '/payments/:paymentId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyPaymentId,
    (request, response) => paymentsController.updatePayment(request, response)
)

module.exports = router