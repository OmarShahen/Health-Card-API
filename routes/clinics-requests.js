const router = require('express').Router()
const clinicsRequestsController = require('../controllers/clinics-requests')
const { verifyUserId, verifyClinicId, verifyClinicRequestId } = require('../middlewares/verify-routes-params')

router.post('/v1/clinics-requests', (request, response) => clinicsRequestsController.addClinicRequest(request, response))

router.get('/v1/clinics-requests', (request, response) => clinicsRequestsController.getClinicsRequests(request, response))

router.get(
    '/v1/clinics-requests/users/:userId', 
    verifyUserId,
    (request, response) => clinicsRequestsController.getClinicsRequestsByUserId(request, response)
)

router.get(
    '/v1/clinics-requests/clinics/:clinicId', 
    verifyClinicId,
    (request, response) => clinicsRequestsController.getClinicsRequestsByClinicId(request, response)
)

router.delete(
    '/v1/clinics-requests/:clinicRequestId',
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.deleteClinicRequest(request, response)
)

router.patch(
    '/v1/clinics-requests/:clinicRequestId',
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.updateClinicRequestStatus(request, response)
)

module.exports = router