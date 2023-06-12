const router = require('express').Router()
const clinicsPatientsController = require('../controllers/clinics-patients')
const { verifyClinicPatientId } = require('../middlewares/verify-routes-params')

router.get('/v1/clinics-patients', (request, response) => clinicsPatientsController.getClinicsPatients(request, response))

router.post('/v1/clinics-patients', (request, response) => clinicsPatientsController.addClinicPatient(request, response))

router.post('/v1/clinics-patients/card-ID', (request, response) => clinicsPatientsController.addClinicPatientByCardId(request, response))

router.delete(
    '/v1/clinics-patients/:clinicPatientId',
    verifyClinicPatientId,
    (request, response) => clinicsPatientsController.deleteClinicPatient(request, response)
)

module.exports = router