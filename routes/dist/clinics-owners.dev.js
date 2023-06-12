"use strict";

var router = require('express').Router();

var clinicsOwnersController = require('../controllers/clinics-owners');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicOwnerId = _require.verifyClinicOwnerId,
    verifyUserId = _require.verifyUserId;

router.post('/v1/clinics-owners', function (request, response) {
  return clinicsOwnersController.addClinicOwner(request, response);
});
router.get('/v1/clinics-owners/owners/:userId', verifyUserId, function (request, response) {
  return clinicsOwnersController.getClinicsByOwnerId(request, response);
});
router["delete"]('/v1/clinics-owners/:clinicOwnerId', verifyClinicOwnerId, function (request, response) {
  return clinicsOwnersController.deleteClinicOwner(request, response);
});
module.exports = router;