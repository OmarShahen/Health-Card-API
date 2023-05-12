const router = require('express').Router()
const patientsController = require('../controllers/patients')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyClinicId, verifyPatientId, verifyCardUUID, verifyUserId, verifyDoctorId } = require('../middlewares/verify-routes-params')

router.post('/v1/patients', (request, response) => patientsController.addPatient(request, response))

router.post('/v1/patients/:patientId/emergency-contacts', verifyPatientId, (request, response) => patientsController.addEmergencyContactToPatient(request, response))

//router.get('/v1/patients/:clinicId', verifyClinicId, (request, response) => patientsController.getClinicPatients(request, response))

router.get('/v1/patients/:patientId/encounters', verifyPatientId, (request, response) => patientsController.getPatientInfo(request, response))

router.get('/v1/patients/:patientId', verifyPatientId, (request, response) => patientsController.getPatient(request, response))

router.get('/v1/patients/cards/:cardUUID', verifyCardUUID, (request, response) => patientsController.getPatientByCardUUID(request, response))

router.patch('/v1/patients/cardsId/:cardId/doctors', (request, response) => patientsController.addDoctorToPatient(request, response))

router.get('/v1/patients/doctors/:userId', verifyUserId, (request, response) => patientsController.getPatientsByDoctorId(request, response))

router.get('/v1/patients/:patientId/doctors', verifyPatientId, (request, response) => patientsController.getPatientDoctors(request, response))

router.delete(
    '/v1/patients/:patientId/emergency-contacts/country-codes/:countryCode/phones/:phone', 
    verifyPatientId, 
    (request, response) => patientsController.deleteEmergencyContactOfPatient(request, response)
)

router.put(
    '/v1/patients/:patientId/emergency-contacts/:contactId',
    verifyPatientId,
    (request, response) => patientsController.updateEmergencyContactOfPatient(request, response)
)

router.delete(
    '/v1/patients/:patientId/doctors/:doctorId',
    verifyPatientId,
    verifyDoctorId,
    (request, response) => patientsController.deleteDoctorFromPatient(request, response)
)

module.exports = router