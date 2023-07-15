"use strict";

var router = require('express').Router();

var clinicsOwnersController = require('../controllers/clinics-owners');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicOwnerId = _require.verifyClinicOwnerId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.post('/v1/clinics-owners', authorization.allPermission, function (request, response) {
  return clinicsOwnersController.addClinicOwner(request, response);
});
router.get('/v1/clinics-owners/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsOwnersController.getClinicsByOwnerId(request, response);
});
router.get('/v1/clinics-owners/owners/:userId/owner-created', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsOwnersController.getClinicsByOwnerIdWhichIsCreatedByOwner(request, response);
});
router["delete"]('/v1/clinics-owners/:clinicOwnerId', authorization.allPermission, verifyClinicOwnerId, function (request, response) {
  return clinicsOwnersController.deleteClinicOwner(request, response);
});
module.exports = router;