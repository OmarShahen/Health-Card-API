const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const inventoryController = require('../controllers/inventory')

router.post(
    '/inventory/clubs/:clubId/receive', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => inventoryController.receiveItems(request, response)
)

router.post(
    '/inventory/clubs/:clubId/deduct', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => inventoryController.deductItems(request, response)
)

router.get(
    '/inventory/clubs/:clubId/stats',
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => inventoryController.getClubInventoryStats(request, response)
)

router.get(
    '/inventory/clubs/:clubId',
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => inventoryController.getInventoryPayments(request, response)
)

router.delete(
    '/inventory/payments/:paymentId/type/earn',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyPaymentId,
    (request, response) => inventoryController.deleteDeductItemPayment(request, response)
)

router.delete(
    '/inventory/payments/:paymentId/type/deduct',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyPaymentId,
    (request, response) => inventoryController.deleteReceiveItemPayment(request, response)
)


module.exports = router