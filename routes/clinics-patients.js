const router = require('express').Router()
const clinicsPatientsController = require('../controllers/clinics-patients')
const { verifyClinicPatientId, verifyClinicId, verifyLabelId, verifyUserId } = require('../middlewares/verify-routes-params')
const { verifyClinicPatients } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')

router.get(
    '/v1/clinics-patients',
    authorization.allPermission,
    (request, response) => clinicsPatientsController.getClinicsPatients(request, response)
)

router.get(
    '/v1/clinics-patients/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => clinicsPatientsController.getClinicPatientsByClinicId(request, response)
)

router.get(
    '/v1/clinics-patients/clinics/:clinicId/search',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => clinicsPatientsController.searchClinicsPatients(request, response)
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

router.patch(
    '/v1/clinics-patients/:clinicPatientId/survey',
    authorization.allPermission,
    verifyClinicPatientId,
    (request, response) => clinicsPatientsController.setClinicPatientSurveyed(request, response)
)

router.post(
    '/v1/clinics-patients/:clinicPatientId/labels',
    authorization.allPermission,
    verifyClinicPatientId,
    (request, response) => clinicsPatientsController.addClinicPatientLabel(request, response)
)

router.delete(
    '/v1/clinics-patients/:clinicPatientId/labels/:labelId',
    authorization.allPermission,
    verifyClinicPatientId,
    verifyLabelId,
    (request, response) => clinicsPatientsController.removeClinicPatientLabel(request, response)
)

router.post(
    '/v1/clinics-patients/convert/clinics-patients-doctors/clinics/:clinicId/doctors/:userId',
    authorization.allPermission,
    verifyClinicId,
    verifyUserId,
    (request, response) => clinicsPatientsController.convertDoctorPatientsToClinicPatients(request, response)
)

module.exports = router