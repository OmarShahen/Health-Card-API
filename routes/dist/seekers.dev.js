"use strict";

var router = require('express').Router();

var seekersController = require('../controllers/seekers');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/seekers', authorization.allPermission, function (request, response) {
  return seekersController.getSeekers(request, response);
});
router.get('/v1/seekers/name/search', authorization.allPermission, function (request, response) {
  return seekersController.searchSeekersByName(request, response);
});
router["delete"]('/v1/seekers/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return seekersController.deleteSeeker(request, response);
});
module.exports = router;