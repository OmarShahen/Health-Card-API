"use strict";

var router = require('express').Router();

var expertVerificationController = require('../controllers/expertVerifications');

var _require = require('../middlewares/verify-routes-params'),
    verifyExpertVerificationId = _require.verifyExpertVerificationId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/experts-verifications', authorization.allPermission, function (request, response) {
  return expertVerificationController.getExpertVerifications(request, response);
});
router.get('/v1/experts-verifications/search/name', authorization.allPermission, function (request, response) {
  return expertVerificationController.searchExpertsVerificationsByName(request, response);
});
router.get('/v1/stats/experts-verifications/growth', authorization.allPermission, function (request, response) {
  return expertVerificationController.getExpertVerificationsGrowthStats(request, response);
});
router.post('/v1/experts-verifications', function (request, response) {
  return expertVerificationController.addExpertVerification(request, response);
});
router.patch('/v1/experts-verifications/:expertVerificationId/status', authorization.allPermission, verifyExpertVerificationId, function (request, response) {
  return expertVerificationController.updateExpertVerificationStatus(request, response);
});
router["delete"]('/v1/experts-verifications/:expertVerificationId', authorization.allPermission, verifyExpertVerificationId, function (request, response) {
  return expertVerificationController.deleteExpertVerification(request, response);
});
module.exports = router;