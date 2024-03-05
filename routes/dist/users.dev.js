"use strict";

var router = require('express').Router();

var usersController = require('../controllers/users');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/users/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.getUser(request, response);
});
router.get('/v1/users/:userId/types/patients', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.getPatient(request, response);
});
router.get('/v1/users/:userId/experts', verifyUserId, function (request, response) {
  return usersController.getExpertUser(request, response);
});
router.get('/v1/users/roles/app', authorization.allPermission, function (request, response) {
  return usersController.getAppUsers(request, response);
});
router.get('/v1/users/:userId/speciality', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.getUserSpeciality(request, response);
});
router.put('/v1/users/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserMainData(request, response);
});
router.patch('/v1/users/:userId/profile-image', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserProfileImage(request, response);
});
router.put('/v1/users/:userId/speciality', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserSpeciality(request, response);
});
router.patch('/v1/users/:userId/email', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserEmail(request, response);
});
router.patch('/v1/users/:userId/language', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserLanguage(request, response);
});
router.patch('/v1/users/:userId/password', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserPassword(request, response);
});
router.patch('/v1/users/:userId/password/verify', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.verifyAndUpdateUserPassword(request, response);
});
router["delete"]('/v1/users/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.deleteUser(request, response);
});
router.post('/v1/users/employee', authorization.allPermission, function (request, response) {
  return usersController.addEmployeeUser(request, response);
});
router.patch('/v1/users/:userId/visibility', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserVisibility(request, response);
});
router.patch('/v1/users/:userId/blocked', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserBlocked(request, response);
});
router.patch('/v1/users/:userId/activation', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserActivation(request, response);
});
module.exports = router;