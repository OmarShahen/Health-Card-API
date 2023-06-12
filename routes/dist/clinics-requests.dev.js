"use strict";

var router = require('express').Router();

var clinicsRequestsController = require('../controllers/clinics-requests');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId,
    verifyClinicId = _require.verifyClinicId,
    verifyClinicRequestId = _require.verifyClinicRequestId;

router.post('/v1/clinics-requests', function (request, response) {
  return clinicsRequestsController.addClinicRequest(request, response);
});
router.get('/v1/clinics-requests', function (request, response) {
  return clinicsRequestsController.getClinicsRequests(request, response);
});
router.get('/v1/clinics-requests/users/:userId', verifyUserId, function (request, response) {
  return clinicsRequestsController.getClinicsRequestsByUserId(request, response);
});
router.get('/v1/clinics-requests/clinics/:clinicId', verifyClinicId, function (request, response) {
  return clinicsRequestsController.getClinicsRequestsByClinicId(request, response);
});
router["delete"]('/v1/clinics-requests/:clinicRequestId', verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.deleteClinicRequest(request, response);
});
router.patch('/v1/clinics-requests/:clinicRequestId', verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.updateClinicRequestStatus(request, response);
});
module.exports = router;