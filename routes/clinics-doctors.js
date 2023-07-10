const router = require('express').Router()
const clinicsDoctorsController = require('../controllers/clinics-doctors')
const { verifyClinicDoctorId, verifyUserId, verifyClinicId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.get(
    '/v1/clinics-doctors',
    authorization.allPermission,
    (request, response) => clinicsDoctorsController.getClinicsDoctors(request, response)
)

router.get(
    '/v1/clinics-doctors/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsDoctorsController.getClinicsDoctorsByOwnerId(request, response)
)

router.get(
    '/v1/clinics-doctors/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => clinicsDoctorsController.getClinicsDoctorsByClinicId(request, response)
)

router.post(
    '/v1/clinics-doctors',
    authorization.allPermission,
    (request, response) => clinicsDoctorsController.addClinicDoctor(request, response)
)

router.delete(
    '/v1/clinics-doctors/:clinicDoctorId',
    authorization.allPermission,
    verifyClinicDoctorId,
    (request, response) => clinicsDoctorsController.deleteClinicDoctor(request, response)
)

module.exports = router