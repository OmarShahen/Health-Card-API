const router = require('express').Router()
const clinicsController = require('../controllers/clinics')
const { verifyDoctorId, verifyPatientId, verifyClinicId, verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.post(
    '/v1/clinics',
    authorization.allPermission, 
    (request, response) => clinicsController.addClinic(request, response)
)

router.get(
    '/v1/clinics', 
    authorization.allPermission,
    (request, response) => clinicsController.getClinics(request, response)
)

router.get(
    '/v1/clinics/doctors/:doctorId', 
    authorization.allPermission,
    verifyDoctorId, 
    (request, response) => clinicsController.getClinicsByDoctorId(request, response)
)

router.get(
    '/v1/clinics/owners/:userId/staffs',
    authorization.allPermission,
    verifyUserId,
    (request, response) => clinicsController.getClinicsStaffsByOwnerId(request, response)
)

router.put(
    '/v1/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => clinicsController.updateClinic(request, response)
)

router.get(
    '/v1/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => clinicsController.getClinic(request, response)
)

router.get(
    '/v1/clinics/patients/:patientId',
    authorization.allPermission,
    verifyPatientId,
    (request, response) => clinicsController.getClinicsByPatientId(request, response)
)


module.exports = router