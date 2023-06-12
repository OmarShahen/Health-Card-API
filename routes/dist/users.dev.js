"use strict";

var router = require('express').Router();

var usersController = require('../controllers/users');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId;

router.get('/v1/users/:userId', verifyUserId, function (request, response) {
  return usersController.getUser(request, response);
});
router.get('/v1/users/:userId/speciality', verifyUserId, function (request, response) {
  return usersController.getUserSpeciality(request, response);
});
router.put('/v1/users/:userId', verifyUserId, function (request, response) {
  return usersController.updateUser(request, response);
});
router.put('/v1/users/:userId/speciality', verifyUserId, function (request, response) {
  return usersController.updateUserSpeciality(request, response);
});
router.patch('/v1/users/:userId/email', verifyUserId, function (request, response) {
  return usersController.updateUserEmail(request, response);
});
router.patch('/v1/users/:userId/password', verifyUserId, function (request, response) {
  return usersController.updateUserPassword(request, response);
});
router.patch('/v1/users/:userId/password/verify', verifyUserId, function (request, response) {
  return usersController.verifyAndUpdateUserPassword(request, response);
});
router["delete"]('/v1/users/:userId', verifyUserId, function (request, response) {
  return usersController.deleteUser(request, response);
});
module.exports = router;