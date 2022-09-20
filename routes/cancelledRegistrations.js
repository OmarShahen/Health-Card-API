const router = require('express').Router()
const cancelledRegistrationsController = require('../controllers/cancelledRegistrations')
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/cancelled-registrations', (request, response) => cancelledRegistrationsController.addCancelRegistration(request, response))

router.get('/cancelled-registrations/clubs/:clubId', verifyIds.verifyClubId, (request, response) => cancelledRegistrationsController.getCancelledRegistrations(request, response))

router.get(
    '/cancelled-registrations/chain-owners/:ownerId', 
    verifyIds.verifyChainOwnerId, 
    (request, response) => cancelledRegistrationsController.getCancelledRegistrationsByOwner(request, response)
    )

module.exports = router