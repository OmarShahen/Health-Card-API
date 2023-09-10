const router = require('express').Router()
const encountersController = require('../controllers/encounters')
const { verifyPatientId, verifyUserId, verifyEncounterId, verifyClinicId } = require('../middlewares/verify-routes-params')
const { verifyClinicEncounters } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')
const actionAccess = require('../middlewares/verify-action-access')

router.post(
    '/v1/encounters', 
    authorization.allPermission,
    verifyClinicEncounters,
    (request, response) => encountersController.addEncounter(request, response)
)

router.get(
    '/v1/encounters/patients/:patientId', 
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => encountersController.getPatientEncounters(request, response)
)

router.get(
    '/v1/encounters/clinics/:clinicId/patients/:patientId', 
    authorization.allPermission,
    verifyClinicId,
    verifyPatientId, 
    (request, response) => encountersController.getClinicPatientEncounters(request, response)
)

router.get(
    '/v1/encounters/doctors/:userId', 
    authorization.allPermission,
    verifyUserId, 
    (request, response) => encountersController.getDoctorEncounters(request, response)
)

router.get(
    '/v1/encounters/:encounterId',
    authorization.allPermission,
    verifyEncounterId, 
    (request, response) => encountersController.getEncounter(request, response)
)

router.delete(
    '/v1/encounters/:encounterId', 
    authorization.allPermission,
    verifyEncounterId,
    actionAccess.verifyDoctorActionAccess,
    (request, response) => encountersController.deleteEncounter(request, response)
)


router.put(
    '/v1/encounters/:encounterId',
    authorization.allPermission,
    verifyEncounterId,
    actionAccess.verifyDoctorActionAccess,
    (request, response) => encountersController.updateEncounter(request, response)
)

module.exports = router