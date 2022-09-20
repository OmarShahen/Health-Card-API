const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const packagesController = require('../controllers/packages')

router.post('/packages', (request, response) => packagesController.addPackage(request, response))

router.get(
    '/packages/clubs/:clubId', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyClubId, 
    (request, response) => packagesController.getPackages(request, response)
    )

router.put('/packages/:packageId', verifyIds.verifyPackageId, (request, response) => packagesController.updatePackage(request, response))

router.delete('/packages/:packageId', verifyIds.verifyPackageId, (request, response) => packagesController.deletePackage(request, response))

router.patch('/packages/:packageId', verifyIds.verifyPackageId, (request, response) => packagesController.updatePackageStatus(request, response))

router.delete('/packages/:packageId/wild', verifyIds.verifyPackageId, (request, response) => packagesController.deletedPackageAndRelated(request, response))

router.get('/packages/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => packagesController.getClubPackagesStatsByDate(request, response))

router.get('/packages/:packageId/stats', verifyIds.verifyPackageId, (request, response) => packagesController.getClubPackageStatsByDate(request, response))

router.get('/packages/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => packagesController.getPackagesByOwner(request, response))

router.get('/packages/chain-owners/:ownerId/stats', verifyIds.verifyChainOwnerId, (request, response) => packagesController.getChainOwnerPackagesStatsByDate(request, response))

module.exports = router