"use strict";

var router = require('express').Router();

var clinicsController = require('../controllers/clinics');

var _require = require('../middlewares/verify-routes-params'),
    verifyDoctorId = _require.verifyDoctorId,
    verifyPatientId = _require.verifyPatientId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.post('/v1/clinics', authorization.allPermission, function (request, response) {
  return clinicsController.addClinic(request, response);
});
router.get('/v1/clinics', authorization.allPermission, function (request, response) {
  return clinicsController.getClinics(request, response);
});
router.get('/v1/clinics/doctors/:doctorId', authorization.allPermission, verifyDoctorId, function (request, response) {
  return clinicsController.getClinicsByDoctorId(request, response);
});
router.get('/v1/clinics/owners/:userId/staffs', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsController.getClinicsStaffsByOwnerId(request, response);
});
router.put('/v1/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return clinicsController.updateClinic(request, response);
});
router.get('/v1/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return clinicsController.getClinic(request, response);
});
router.get('/v1/clinics/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return clinicsController.getClinicsByPatientId(request, response);
});
router.get('/v1/clinics/followup-service/clinics-subscriptions/active', authorization.allPermission, function (request, response) {
  return clinicsController.getFollowupServiceActiveSubscribedClinics(request, response);
});
router.get('/v1/clinics/followup-service/clinics-subscriptions/all', authorization.allPermission, function (request, response) {
  return clinicsController.getFollowupServiceSubscribedClinics(request, response);
});
router["delete"]('/v1/clinics/:clinicId', authorization.ownerPermission, verifyClinicId, function (request, response) {
  return clinicsController.deleteClinic(request, response);
});
module.exports = router;