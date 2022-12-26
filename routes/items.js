const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const itemsController = require('../controllers/items')

router.post(
    '/items/clubs/:clubId', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => itemsController.addItem(request, response)
)

router.get(
    '/items/clubs/:clubId',
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId,
    (request, response) => itemsController.getClubItems(request, response)
)

router.get(
    '/items/:itemId/stats',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyItemId,
    (request, response) => itemsController.getItemStats(request, response)
)


router.patch(
    '/items/:itemId/clubs/:clubId',
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyItemId,
    verifyIds.verifyClubId,
    (request, response) => itemsController.updateItem(request, response)
)

router.delete(
    '/items/:itemId',
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyItemId,
    (request, response) => itemsController.deleteItem(request, response)
)

module.exports = router