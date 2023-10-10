const router = require('express').Router()
const medicationChallengesController = require('../../controllers/medication-challenges/medication-challenges')
const authorization = require('../../middlewares/verify-permission')
const { verifyMedicationChallengeId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/medication-challenges', 
    authorization.allPermission,
    (request, response) => medicationChallengesController.getMedicationChallenges(request, response)
)

router.post(
    '/v1/medication-challenges', 
    authorization.allPermission,
    (request, response) => medicationChallengesController.addMedicationChallenge(request, response)
)

router.put(
    '/v1/medication-challenges/:medicationChallengeId', 
    authorization.allPermission,
    verifyMedicationChallengeId,
    (request, response) => medicationChallengesController.updateMedicationChallenge(request, response)
)

router.delete(
    '/v1/medication-challenges/:medicationChallengeId', 
    authorization.allPermission,
    verifyMedicationChallengeId,
    (request, response) => medicationChallengesController.deleteMedicationChallenge(request, response)
)


module.exports = router