const router = require('express').Router()
const encountersController = require('../controllers/encounters')
const { verifyPatientId, verifyUserId, verifyEncounterId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.post(
    '/v1/encounters', 
    authorization.allPermission,
    (request, response) => encountersController.addEncounter(request, response)
)

router.get(
    '/v1/encounters/patients/:patientId', 
    authorization.allPermission,
    verifyPatientId, 
    (request, response) => encountersController.getPatientEncounters(request, response)
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
    (request, response) => encountersController.deleteEncounter(request, response)
)

router.post(
    '/v1/encounters/cardsId/:cardId', 
    authorization.allPermission,
    (request, response) => encountersController.addEncounterByPatientCardId(request, response)
)

router.put(
    '/v1/encounters/:encounterId',
    authorization.allPermission,
    verifyEncounterId,
    (request, response) => encountersController.updateEncounter(request, response)
)

module.exports = router