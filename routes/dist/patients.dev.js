"use strict";

var router = require('express').Router();

var patientsController = require('../controllers/patients');

var _require = require('../middlewares/verify-routes-params'),
    verifyPatientId = _require.verifyPatientId,
    verifyUserId = _require.verifyUserId,
    verifyDoctorId = _require.verifyDoctorId,
    verifyClinicId = _require.verifyClinicId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicPatients = _require2.verifyClinicPatients;

var authorization = require('../middlewares/verify-permission');

router.post('/v1/patients', authorization.allPermission, verifyClinicPatients, function (request, response) {
  return patientsController.addPatient(request, response);
});
router.put('/v1/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsController.updatePatient(request, response);
});
router.post('/v1/patients/:patientId/emergency-contacts', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsController.addEmergencyContactToPatient(request, response);
});
router.get('/v1/patients/:patientId/encounters', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsController.getPatientInfo(request, response);
});
router.get('/v1/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsController.getPatient(request, response);
});
router.get('/v1/patients/cards/:cardId', function (request, response) {
  return patientsController.getPatientByCardId(request, response);
});
router.patch('/v1/patients/cardsId/:cardId/doctors', authorization.allPermission, function (request, response) {
  return patientsController.addDoctorToPatient(request, response);
});
router.get('/v1/patients/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return patientsController.getPatientsByClinicId(request, response);
});
router.get('/v1/patients/doctors/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return patientsController.getPatientsByDoctorId(request, response);
});
router.get('/v1/patients/:patientId/doctors', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsController.getDoctorsByPatientId(request, response);
});
router["delete"]('/v1/patients/:patientId/emergency-contacts/country-codes/:countryCode/phones/:phone', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsController.deleteEmergencyContactOfPatient(request, response);
});
router.put('/v1/patients/:patientId/emergency-contacts/:contactId', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsController.updateEmergencyContactOfPatient(request, response);
});
router["delete"]('/v1/patients/:patientId/doctors/:doctorId', authorization.allPermission, verifyPatientId, verifyDoctorId, function (request, response) {
  return patientsController.deleteDoctorFromPatient(request, response);
});
router.get('/v1/patients/followup-service/clinics-subscriptions/active', authorization.allPermission, function (request, response) {
  return patientsController.getFollowupRegisteredClinicsPatients(request, response);
});
router.get('/v1/patients/registered-by/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return patientsController.getPatientsByRegisteredById(request, response);
});
module.exports = router;