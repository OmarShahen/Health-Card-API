"use strict";

var router = require('express').Router();

var insurancePoliciesController = require('../controllers/insurance-policies');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId,
    verifyInsurancePolicyId = _require.verifyInsurancePolicyId,
    verifyInsuranceId = _require.verifyInsuranceId,
    verifyPatientId = _require.verifyPatientId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicServices = _require2.verifyClinicServices;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/insurance-policies', authorization.allPermission, function (request, response) {
  return insurancePoliciesController.getInsurancePolicies(request, response);
});
router.post('/v1/insurance-policies', authorization.allPermission, function (request, response) {
  return insurancePoliciesController.addInsurancePolicy(request, response);
});
router.get('/v1/insurance-policies/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return insurancePoliciesController.getInsurancePoliciesByClinicId(request, response);
});
router.get('/v1/insurance-policies/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return insurancePoliciesController.getInsurancePoliciesByPatientId(request, response);
});
router.get('/v1/insurance-policies/patients/:patientId/clinics/:clinicId', authorization.allPermission, verifyPatientId, verifyClinicId, function (request, response) {
  return insurancePoliciesController.getClinicPatientActiveInsurancePolicy(request, response);
});
router.get('/v1/insurance-policies/clinics/:clinicId/patients/:patientId/all', authorization.allPermission, verifyPatientId, verifyClinicId, function (request, response) {
  return insurancePoliciesController.getClinicInsurancePoliciesByPatientId(request, response);
});
router.get('/v1/insurance-policies/insurances/:insuranceId', authorization.allPermission, verifyInsuranceId, function (request, response) {
  return insurancePoliciesController.getInsurancePoliciesByInsuranceCompanyId(request, response);
});
router.get('/v1/insurance-policies/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return insurancePoliciesController.getInsurancePoliciesByOwnerId(request, response);
});
router["delete"]('/v1/insurance-policies/:insurancePolicyId', authorization.allPermission, verifyInsurancePolicyId, function (request, response) {
  return insurancePoliciesController.deleteInsurancePolicy(request, response);
});
router.patch('/v1/insurance-policies/:insurancePolicyId/status', authorization.allPermission, verifyInsurancePolicyId, function (request, response) {
  return insurancePoliciesController.updateInsurancePolicyStatus(request, response);
});
router.put('/v1/insurance-policies/:insurancePolicyId', authorization.allPermission, verifyInsurancePolicyId, function (request, response) {
  return insurancePoliciesController.updateInsurancePolicy(request, response);
});
module.exports = router;