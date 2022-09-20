const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const freezeRegistrationsController = require('../controllers/freezeRegistrations')

router.post(
    '/freeze-registrations', 
    tokenMiddleware.appUsersPermission, 
    (request, response) => freezeRegistrationsController.addFreezeRegistration(request, response)
    )

router.get('/freeze-registrations/clubs/:clubId', verifyIds.verifyClubId, (request, response) => freezeRegistrationsController.getClubFreezedRegistrations(request, response))

router.patch(
    '/freeze-registrations/registrations/:registrationId', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyRegistrationId, 
    (request, response) => freezeRegistrationsController.reactivateRegistration(request, response)
    )

router.get(
    '/freeze-registrations/chain-owners/:ownerId', 
    verifyIds.verifyChainOwnerId, 
    (request, response) => freezeRegistrationsController.getFreezeRegistrationsByOwner(request, response))


module.exports = router