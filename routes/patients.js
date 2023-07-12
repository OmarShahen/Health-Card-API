const router = require('express').Router()
const patientsController = require('../controllers/patients')
const { verifyPatientId, verifyUserId, verifyDoctorId, verifyClinicId } = require('../middlewares/verify-routes-params')
const { verifyClinicPatients } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')

router.post(
    '/v1/patients',
    authorization.allPermission,
    verifyClinicPatients, 
    (request, response) => patientsController.addPatient(request, response)
)

router.post(
    '/v1/patients/:patientId/emergency-contacts',
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => patientsController.addEmergencyContactToPatient(request, response)
)

router.get(
    '/v1/patients/:patientId/encounters',
    authorization.allPermission, 
    verifyPatientId, 
    (request, response) => patientsController.getPatientInfo(request, response)
)

router.get(
    '/v1/patients/:patientId',
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => patientsController.getPatient(request, response)
)

router.get(
    '/v1/patients/cards/:cardId',
    (request, response) => patientsController.getPatientByCardId(request, response)
)

router.patch(
    '/v1/patients/cardsId/:cardId/doctors',
    authorization.allPermission,
    (request, response) => patientsController.addDoctorToPatient(request, response)
)

router.get(
    '/v1/patients/clinics/:clinicId', 
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => patientsController.getPatientsByClinicId(request, response)
)

router.get(
    '/v1/patients/doctors/:userId', 
    authorization.allPermission,
    verifyUserId, 
    (request, response) => patientsController.getPatientsByDoctorId(request, response)
)

router.get(
    '/v1/patients/:patientId/doctors',
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => patientsController.getDoctorsByPatientId(request, response)
)

router.delete(
    '/v1/patients/:patientId/emergency-contacts/country-codes/:countryCode/phones/:phone',
    authorization.staffPermission,
    verifyPatientId, 
    (request, response) => patientsController.deleteEmergencyContactOfPatient(request, response)
)

router.put(
    '/v1/patients/:patientId/emergency-contacts/:contactId',
    authorization.staffPermission,
    verifyPatientId,
    (request, response) => patientsController.updateEmergencyContactOfPatient(request, response)
)

router.delete(
    '/v1/patients/:patientId/doctors/:doctorId',
    authorization.allPermission,
    verifyPatientId,
    verifyDoctorId,
    (request, response) => patientsController.deleteDoctorFromPatient(request, response)
)

module.exports = router