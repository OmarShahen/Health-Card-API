const router = require('express').Router()
const clinicsPatientsController = require('../controllers/clinics-patients')
const { verifyClinicPatientId } = require('../middlewares/verify-routes-params')
const { verifyClinicPatients } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')

router.get(
    '/v1/clinics-patients',
    authorization.allPermission,
    (request, response) => clinicsPatientsController.getClinicsPatients(request, response)
)

router.post(
    '/v1/clinics-patients',
    authorization.allPermission,
    verifyClinicPatients,
    (request, response) => clinicsPatientsController.addClinicPatient(request, response)
)

router.post(
    '/v1/clinics-patients/card-ID',
    authorization.allPermission,
    verifyClinicPatients,
    (request, response) => clinicsPatientsController.addClinicPatientByCardId(request, response)
)

router.delete(
    '/v1/clinics-patients/:clinicPatientId',
    authorization.allPermission,
    verifyClinicPatientId,
    (request, response) => clinicsPatientsController.deleteClinicPatient(request, response)
)

module.exports = router