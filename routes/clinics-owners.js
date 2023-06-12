const router = require('express').Router()
const clinicsOwnersController = require('../controllers/clinics-owners')
const { verifyClinicOwnerId, verifyUserId } = require('../middlewares/verify-routes-params')

router.post('/v1/clinics-owners', (request, response) => clinicsOwnersController.addClinicOwner(request, response))

router.get(
    '/v1/clinics-owners/owners/:userId',
    verifyUserId,
    (request, response) => clinicsOwnersController.getClinicsByOwnerId(request, response)
)

router.delete(
    '/v1/clinics-owners/:clinicOwnerId', 
    verifyClinicOwnerId,
    (request, response) => clinicsOwnersController.deleteClinicOwner(request, response)
)

module.exports = router