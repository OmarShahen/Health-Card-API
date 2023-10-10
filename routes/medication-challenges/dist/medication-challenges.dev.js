"use strict";

var router = require('express').Router();

var medicationChallengesController = require('../../controllers/medication-challenges/medication-challenges');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyMedicationChallengeId = _require.verifyMedicationChallengeId;

router.get('/v1/medication-challenges', authorization.allPermission, function (request, response) {
  return medicationChallengesController.getMedicationChallenges(request, response);
});
router.post('/v1/medication-challenges', authorization.allPermission, function (request, response) {
  return medicationChallengesController.addMedicationChallenge(request, response);
});
router.put('/v1/medication-challenges/:medicationChallengeId', authorization.allPermission, verifyMedicationChallengeId, function (request, response) {
  return medicationChallengesController.updateMedicationChallenge(request, response);
});
router["delete"]('/v1/medication-challenges/:medicationChallengeId', authorization.allPermission, verifyMedicationChallengeId, function (request, response) {
  return medicationChallengesController.deleteMedicationChallenge(request, response);
});
module.exports = router;