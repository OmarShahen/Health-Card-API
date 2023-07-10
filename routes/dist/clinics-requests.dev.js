"use strict";

var router = require('express').Router();

var clinicsRequestsController = require('../controllers/clinics-requests');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId,
    verifyClinicId = _require.verifyClinicId,
    verifyClinicRequestId = _require.verifyClinicRequestId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicAddDoctorRequest = _require2.verifyClinicAddDoctorRequest,
    verifyClinicAddOwnerRequest = _require2.verifyClinicAddOwnerRequest;

var authorization = require('../middlewares/verify-permission');

router.post('/v1/clinics-requests', authorization.allPermission, function (request, response) {
  return clinicsRequestsController.addClinicRequest(request, response);
});
router.post('/v1/clinics-requests/doctors/email', authorization.allPermission, verifyClinicAddDoctorRequest, function (request, response) {
  return clinicsRequestsController.addDoctorClinicRequestByReceiverEmail(request, response);
});
router.post('/v1/clinics-requests/users/staffs', authorization.allPermission, function (request, response) {
  return clinicsRequestsController.addStaffClinicRequestByClinicId(request, response);
});
router.post('/v1/clinics-requests/owners/email', authorization.allPermission, verifyClinicAddOwnerRequest, function (request, response) {
  return clinicsRequestsController.addOwnerClinicRequestByReceiverEmail(request, response);
});
router.get('/v1/clinics-requests', authorization.allPermission, function (request, response) {
  return clinicsRequestsController.getClinicsRequests(request, response);
});
router.get('/v1/clinics-requests/owners/:userId/staffs', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsRequestsController.getStaffsClinicsRequestsByOwnerId(request, response);
});
router.get('/v1/clinics-requests/owners/:userId/doctors', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsRequestsController.getDoctorsClinicsRequestsByOwnerId(request, response);
});
router.get('/v1/clinics-requests/owners/:userId/owners', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsRequestsController.getOwnersClinicsRequestsByOwnerId(request, response);
});
router.get('/v1/clinics-requests/users/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsRequestsController.getClinicsRequestsByUserId(request, response);
});
router.get('/v1/clinics-requests/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsRequestsController.getOwnerClinicsRequests(request, response);
});
router.get('/v1/clinics-requests/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return clinicsRequestsController.getClinicsRequestsByClinicId(request, response);
});
router.get('/v1/clinics-requests/users/:userId/status/:status', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsRequestsController.getUserClinicRequestsWithStatus(request, response);
});
router["delete"]('/v1/clinics-requests/:clinicRequestId/staffs', authorization.allPermission, verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.deleteStaffClinicRequest(request, response);
});
router["delete"]('/v1/clinics-requests/:clinicRequestId/doctors', authorization.allPermission, verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.deleteDoctorClinicRequest(request, response);
});
router["delete"]('/v1/clinics-requests/:clinicRequestId/owners', authorization.allPermission, verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.deleteOwnerClinicRequest(request, response);
});
router.patch('/v1/clinics-requests/:clinicRequestId/doctors', authorization.allPermission, verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.updateDoctorClinicRequestStatus(request, response);
});
router.patch('/v1/clinics-requests/:clinicRequestId/staffs', authorization.allPermission, verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.updateStaffClinicRequestStatus(request, response);
});
router.patch('/v1/clinics-requests/:clinicRequestId/owners', authorization.allPermission, verifyClinicRequestId, function (request, response) {
  return clinicsRequestsController.updateOwnerClinicRequestStatus(request, response);
});
module.exports = router;