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

router.post(
    '/payments/clubs/:clubId/payrolls',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.addPayrollPayment(request, response)
)

router.post(
    '/payments/clubs/:clubId/maintenance',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.addMaintenancePayment(request, response)
)

router.post(
    '/payments/clubs/:clubId/bills',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.addBillPayment(request, response)
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

router.get(
    '/payments/clubs/:clubId/stats',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.getClubPaymentsStats(request, response) 
)

router.get(
    '/payments/clubs/:clubId/categories/:category',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.getClubCategoryPaymentsStats(request, response)
)

router.get(
    '/payments/clubs/:clubId/payrolls',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId,
    (request, response) => paymentsController.getClubPayrolls(request, response)
)

module.exports = router