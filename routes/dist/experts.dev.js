"use strict";

var router = require('express').Router();

var expertsController = require('../controllers/experts');

var _require = require('../middlewares/verify-routes-params'),
    verifySpecialityId = _require.verifySpecialityId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/experts/specialities/:specialityId', verifySpecialityId, function (request, response) {
  return expertsController.searchExperts(request, response);
});
router.get('/v1/experts/specialities/:specialityId/name/:name', verifySpecialityId, function (request, response) {
  return expertsController.searchExpertsByNameAndSpeciality(request, response);
});
router.post('/v1/experts', authorization.allPermission, function (request, response) {
  return expertsController.addExpert(request, response);
});
router.get('/v1/experts', authorization.allPermission, function (request, response) {
  return expertsController.getExperts(request, response);
});
router.get('/v1/experts/name/search', authorization.allPermission, function (request, response) {
  return expertsController.searchExpertsByName(request, response);
});
router["delete"]('/v1/experts/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.deleteExpert(request, response);
});
router.patch('/v1/experts/:userId/bank-info', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.addExpertBankInfo(request, response);
});
module.exports = router;