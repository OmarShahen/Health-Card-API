"use strict";

var router = require('express').Router();

var authController = require('../controllers/auth');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId;

router.post('/v1/auth/signup', function (request, response) {
  return authController.userSignup(request, response);
});
router.post('/v1/auth/login', function (request, response) {
  return authController.userLogin(request, response);
});
router.post('/v1/auth/verify/personal-info', function (request, response) {
  return authController.verifyPersonalInfo(request, response);
});
router.post('/v1/auth/verify/demographic-info', function (request, response) {
  return authController.verifyDemographicInfo(request, response);
});
router.post('/v1/auth/verify/speciality-info', function (request, response) {
  return authController.verifySpecialityInfo(request, response);
});
router.post('/v1/auth/verify/emails/:email', function (request, response) {
  return authController.verifyEmail(request, response);
});
router.post('/v1/auth/verify/reset-password/verifications-codes', function (request, response) {
  return authController.verifyResetPasswordVerificationCode(request, response);
});
router.post('/v1/auth/verify/users/:userId/verification-codes/:verificationCode', verifyUserId, function (request, response) {
  return authController.verifyEmailVerificationCode(request, response);
});
router.post('/v1/auth/forgot-password', function (request, response) {
  return authController.forgotPassword(request, response);
});
router.post('/v1/auth/reset-password', function (request, response) {
  return authController.resetPassword(request, response);
});
router.post('/v1/auth/users/:userId/delete-account', verifyUserId, function (request, response) {
  return authController.sendUserDeleteAccountVerificationCode(request, response);
});
router["delete"]('/v1/auth/users/:userId/verification-code/:verificationCode', verifyUserId, function (request, response) {
  return authController.verifyDeleteAccountVerificationCode(request, response);
});
router.patch('/v1/auth/users/:userId/verify', verifyUserId, function (request, response) {
  return authController.setUserVerified(request, response);
});
router.post('/v1/auth/users/:userId/send/verification-codes', function (request, response) {
  return authController.addUserEmailVerificationCode(request, response);
});
router.post('/v1/auth/emails/send', function (request, response) {
  return authController.sendEmail(request, response);
});
module.exports = router;