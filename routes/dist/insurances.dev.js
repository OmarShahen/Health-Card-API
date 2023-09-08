"use strict";

var router = require('express').Router();

var insurancesController = require('../controllers/insurances');

var _require = require('../middlewares/verify-routes-params'),
    verifyInsuranceId = _require.verifyInsuranceId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicInvoices = _require2.verifyClinicInvoices;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/insurances', authorization.allPermission, function (request, response) {
  return insurancesController.getInsurances(request, response);
});
router.get('/v1/insurances/:insuranceId', authorization.allPermission, verifyInsuranceId, function (request, response) {
  return insurancesController.getInsurance(request, response);
});
router.get('/v1/insurances/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return insurancesController.getInsurancesByClinicId(request, response);
});
router.get('/v1/insurances/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return insurancesController.getInsurancesByOwnerId(request, response);
});
router.post('/v1/insurances', authorization.allPermission, function (request, response) {
  return insurancesController.addInsurance(request, response);
});
router["delete"]('/v1/insurances/:insuranceId', authorization.allPermission, verifyInsuranceId, function (request, response) {
  return insurancesController.deleteInsurance(request, response);
});
router.put('/v1/insurances/:insuranceId', authorization.allPermission, verifyInsuranceId, function (request, response) {
  return insurancesController.updateInsurance(request, response);
});
router.patch('/v1/insurances/:insuranceId/status', authorization.allPermission, verifyInsuranceId, function (request, response) {
  return insurancesController.updateInsuranceStatus(request, response);
});
module.exports = router;