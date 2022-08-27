const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const packagesController = require('../controllers/packages')

router.post('/packages', (request, response) => packagesController.addPackage(request, response))

router.get('/packages/clubs/:clubId', verifyIds.verifyClubId, (request, response) => packagesController.getPackages(request, response))

router.put('/packages/:packageId', verifyIds.verifyPackageId, (request, response) => packagesController.updatePackage(request, response))

router.delete('/packages/:packageId', verifyIds.verifyPackageId, (request, response) => packagesController.deletePackage(request, response))

router.patch('/packages/:packageId', verifyIds.verifyPackageId, (request, response) => packagesController.updatePackageStatus(request, response))

router.delete('/packages/:packageId/wild', verifyIds.verifyPackageId, (request, response) => packagesController.deletedPackageAndRelated(request, response))

module.exports = router