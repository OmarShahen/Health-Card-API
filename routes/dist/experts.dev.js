"use strict";

var router = require('express').Router();

var expertsController = require('../controllers/experts');

var _require = require('../middlewares/verify-routes-params'),
    verifySpecialityId = _require.verifySpecialityId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.put('/v1/experts/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.updateExpert(request, response);
});
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
router.patch('/v1/experts/:userId/mobile-wallet', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.addExpertMobileWalletInfo(request, response);
});
router.patch('/v1/experts/:userId/onboarding', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.updateExpertOnBoarding(request, response);
});
router.patch('/v1/experts/:userId/promo-codes-acceptance', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.updateExpertPromoCodeAcceptance(request, response);
});
router.patch('/v1/experts/:userId/online', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.updateExpertOnlineStatus(request, response);
});
router.get('/v1/experts/:userId/profile-completion-percentage', authorization.allPermission, verifyUserId, function (request, response) {
  return expertsController.getExpertProfileCompletionPercentage(request, response);
});
module.exports = router;