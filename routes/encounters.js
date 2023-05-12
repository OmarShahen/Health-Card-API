const router = require('express').Router()
const encountersController = require('../controllers/encounters')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyPatientId, verifyUserId, verifyEncounterId } = require('../middlewares/verify-routes-params')

router.post('/v1/encounters', (request, response) => encountersController.addEncounter(request, response))

router.get('/v1/encounters/patients/:patientId', verifyPatientId, (request, response) => encountersController.getPatientEncounters(request, response))

router.get('/v1/encounters/doctors/:userId', verifyUserId, (request, response) => encountersController.getDoctorEncounters(request, response))

router.get('/v1/encounters/:encounterId', verifyEncounterId, (request, response) => encountersController.getEncounter(request, response))

router.delete('/v1/encounters/:encounterId', verifyEncounterId, (request, response) => encountersController.deleteEncounter(request, response))

router.post('/v1/encounters/cardsId/:cardId', (request, response) => encountersController.addEncounterByPatientCardId(request, response))

router.put(
    '/v1/encounters/:encounterId',
    verifyEncounterId,
    (request, response) => encountersController.updateEncounter(request, response)
)

module.exports = router