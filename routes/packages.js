const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const packagesController = require('../controllers/packages')

router.post('/packages', (request, response) => packagesController.addPackage(request, response))

router.get('/packages/clubs/:clubId', verifyIds.verifyClubId, (request, response) => packagesController.getPackages(request, response))

module.exports = router