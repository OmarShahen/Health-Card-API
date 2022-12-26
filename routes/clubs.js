const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const clubsController = require('../controllers/clubs')

router.post(
    '/v1/clubs',
    tokenMiddleware.adminAndOwnerPermission,
    (request, response) => clubsController.addClub(request, response)
    )

router.get(
    '/v1/clubs',
    tokenMiddleware.adminAndOwnerPermission,
    (request, response) => clubsController.getClubs(request, response)
    )

router.get(
    '/v1/clubs/:clubId/stats',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.getClubStatsByDateV1(request, response))

router.get(
    '/v1/clubs/chain-owners/:ownerId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => clubsController.getClubsByOwner(request, response))

router.put(
    '/v1/clubs/:clubId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.updateClub(request, response))

router.patch(
    '/v1/clubs/:clubId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.updateClubStatus(request, response))

router.delete(
    '/v1/clubs/:clubId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.deleteClub(request, response))

router.delete(
    '/v1/clubs/:clubId/wild',
    tokenMiddleware.adminPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.deleteClubAndRelated(request, response))

router.get(
    '/v1/clubs/:clubId/stats/main',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.getClubStatsByDateV1(request, response)
)

router.get(
    '/v1/clubs/:clubId/all',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => clubsController.getAllClubData(request, response)
)

router.patch(
    '/v1/clubs/:clubId/image',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => clubsController.updateClubImage(request, response)
)

router.patch(
    '/v1/clubs/:clubId/whatsapp/offers-limit',
    tokenMiddleware.adminPermission,
    verifyIds.verifyClubId,
    (request, response) => clubsController.updateClubWhatsappOffersLimit(request, response)
)

module.exports = router