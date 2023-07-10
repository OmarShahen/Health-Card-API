"use strict";

var router = require('express').Router();

var usersController = require('../controllers/users');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/users/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.getUser(request, response);
});
router.get('/v1/users/:userId/speciality', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.getUserSpeciality(request, response);
});
router.put('/v1/users/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUser(request, response);
});
router.put('/v1/users/:userId/speciality', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserSpeciality(request, response);
});
router.patch('/v1/users/:userId/email', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.updateUserEmail(request, response);
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
router.patch('/v1/users/:userId/clinics', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.registerStaffToClinic(request, response);
});
router.get('/v1/users/:userId/mode', authorization.allPermission, verifyUserId, function (request, response) {
  return usersController.getUserMode(request, response);
});
module.exports = router;