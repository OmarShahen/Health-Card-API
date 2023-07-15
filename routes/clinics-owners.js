const router = require('express').Router()
const clinicsOwnersController = require('../controllers/clinics-owners')
const { verifyClinicOwnerId, verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.post(
    '/v1/clinics-owners',
    authorization.allPermission,
    (request, response) => clinicsOwnersController.addClinicOwner(request, response)
)

router.get(
    '/v1/clinics-owners/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsOwnersController.getClinicsByOwnerId(request, response)
)

router.get(
    '/v1/clinics-owners/owners/:userId/owner-created',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsOwnersController.getClinicsByOwnerIdWhichIsCreatedByOwner(request, response)
)

router.delete(
    '/v1/clinics-owners/:clinicOwnerId',
    authorization.allPermission,
    verifyClinicOwnerId,
    (request, response) => clinicsOwnersController.deleteClinicOwner(request, response)
)

module.exports = router