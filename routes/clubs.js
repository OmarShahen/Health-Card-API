const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const clubsController = require('../controllers/clubs')

router.post(
    '/clubs',
    tokenMiddleware.adminAndOwnerPermission,
    (request, response) => clubsController.addClub(request, response)
    )

router.get(
    '/clubs',
    tokenMiddleware.adminPermission,
    (request, response) => clubsController.getClubs(request, response)
    )

router.get(
    '/clubs/:clubId/stats',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.getClubStatsByDate(request, response))

router.get(
    '/clubs/chain-owners/:ownerId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => clubsController.getClubsByOwner(request, response))

router.put(
    '/clubs/:clubId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.updateClub(request, response))

router.patch(
    '/clubs/:clubId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.updateClubStatus(request, response))

router.delete(
    '/clubs/:clubId',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.deleteClub(request, response))

router.delete(
    '/clubs/:clubId/wild',
    tokenMiddleware.adminPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.deleteClubAndRelated(request, response))

router.get(
    '/clubs/:clubId/stats/main',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId, 
    (request, response) => clubsController.getClubMainStatsByDate(request, response)
)

router.get(
    '/clubs/:clubId/all',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => clubsController.getAllClubData(request, response)
)

router.patch(
    '/clubs/:clubId/image',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => clubsController.updateClubImage(request, response)
)

module.exports = router