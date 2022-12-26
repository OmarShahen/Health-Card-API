const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const inventoryController = require('../controllers/inventory')

router.post(
    '/inventory/clubs/:clubId/receive', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => inventoryController.receiveItem(request, response)
)

router.post(
    '/inventory/clubs/:clubId/deduct', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => inventoryController.deductItem(request, response)
)

router.get(
    '/inventory/clubs/:clubId/stats',
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => inventoryController.getClubInventoryStats(request, response)
)


module.exports = router