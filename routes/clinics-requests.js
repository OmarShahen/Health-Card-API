const router = require('express').Router()
const clinicsRequestsController = require('../controllers/clinics-requests')
const { verifyUserId, verifyClinicId, verifyClinicRequestId } = require('../middlewares/verify-routes-params')
const { verifyClinicAddDoctorRequest, verifyClinicAddOwnerRequest } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')


router.post(
    '/v1/clinics-requests',
    authorization.allPermission,
    (request, response) => clinicsRequestsController.addClinicRequest(request, response)
)

router.post(
    '/v1/clinics-requests/doctors/email',
    authorization.allPermission,
    verifyClinicAddDoctorRequest, 
    (request, response) => clinicsRequestsController.addDoctorClinicRequestByReceiverEmail(request, response)
)

router.post(
    '/v1/clinics-requests/users/staffs',
    authorization.allPermission, 
    (request, response) => clinicsRequestsController.addStaffClinicRequestByClinicId(request, response)
)

router.post(
    '/v1/clinics-requests/owners/email',
    authorization.allPermission,
    verifyClinicAddOwnerRequest,
    (request, response) => clinicsRequestsController.addOwnerClinicRequestByReceiverEmail(request, response)
)

router.get(
    '/v1/clinics-requests', 
    authorization.allPermission,
    (request, response) => clinicsRequestsController.getClinicsRequests(request, response)
)

router.get(
    '/v1/clinics-requests/owners/:userId/staffs',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsRequestsController.getStaffsClinicsRequestsByOwnerId(request, response)
)

router.get(
    '/v1/clinics-requests/owners/:userId/doctors',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsRequestsController.getDoctorsClinicsRequestsByOwnerId(request, response)
)

router.get(
    '/v1/clinics-requests/owners/:userId/owners',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsRequestsController.getOwnersClinicsRequestsByOwnerId(request, response)
)

router.get(
    '/v1/clinics-requests/users/:userId', 
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsRequestsController.getClinicsRequestsByUserId(request, response)
)

router.get(
    '/v1/clinics-requests/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsRequestsController.getOwnerClinicsRequests(request, response)
)

router.get(
    '/v1/clinics-requests/clinics/:clinicId', 
    authorization.allPermission,
    verifyClinicId,
    (request, response) => clinicsRequestsController.getClinicsRequestsByClinicId(request, response)
)

router.get(
    '/v1/clinics-requests/users/:userId/status/:status',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsRequestsController.getUserClinicRequestsWithStatus(request, response)
)

router.delete(
    '/v1/clinics-requests/:clinicRequestId/staffs',
    authorization.allPermission,
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.deleteStaffClinicRequest(request, response)
)

router.delete(
    '/v1/clinics-requests/:clinicRequestId/doctors',
    authorization.allPermission,
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.deleteDoctorClinicRequest(request, response)
)

router.delete(
    '/v1/clinics-requests/:clinicRequestId/owners',
    authorization.allPermission,
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.deleteOwnerClinicRequest(request, response)
)

router.patch(
    '/v1/clinics-requests/:clinicRequestId/doctors',
    authorization.allPermission,
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.updateDoctorClinicRequestStatus(request, response)
)

router.patch(
    '/v1/clinics-requests/:clinicRequestId/staffs',
    authorization.allPermission,
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.updateStaffClinicRequestStatus(request, response)
)

router.patch(
    '/v1/clinics-requests/:clinicRequestId/owners',
    authorization.allPermission,
    verifyClinicRequestId,
    (request, response) => clinicsRequestsController.updateOwnerClinicRequestStatus(request, response)
)

module.exports = router