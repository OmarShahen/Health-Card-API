"use strict";

var router = require('express').Router();

var patientsController = require('../controllers/patients');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyPatientId = _require.verifyPatientId,
    verifyCardUUID = _require.verifyCardUUID,
    verifyUserId = _require.verifyUserId,
    verifyDoctorId = _require.verifyDoctorId,
    verifyClinicId = _require.verifyClinicId;

router.post('/v1/patients', function (request, response) {
  return patientsController.addPatient(request, response);
});
router.post('/v1/patients/:patientId/emergency-contacts', verifyPatientId, function (request, response) {
  return patientsController.addEmergencyContactToPatient(request, response);
});
router.get('/v1/patients/:patientId/encounters', verifyPatientId, function (request, response) {
  return patientsController.getPatientInfo(request, response);
});
router.get('/v1/patients/:patientId', verifyPatientId, function (request, response) {
  return patientsController.getPatient(request, response);
});
router.get('/v1/patients/cards/:cardUUID', verifyCardUUID, function (request, response) {
  return patientsController.getPatientByCardUUID(request, response);
});
router.patch('/v1/patients/cardsId/:cardId/doctors', function (request, response) {
  return patientsController.addDoctorToPatient(request, response);
});
router.get('/v1/patients/clinics/:clinicId', verifyClinicId, function (request, response) {
  return patientsController.getPatientsByClinicId(request, response);
});
router.get('/v1/patients/doctors/:doctorId', verifyDoctorId, function (request, response) {
  return patientsController.getPatientsByDoctorId(request, response);
});
router.get('/v1/patients/:patientId/doctors', verifyPatientId, function (request, response) {
  return patientsController.getDoctorsByPatientId(request, response);
});
router["delete"]('/v1/patients/:patientId/emergency-contacts/country-codes/:countryCode/phones/:phone', verifyPatientId, function (request, response) {
  return patientsController.deleteEmergencyContactOfPatient(request, response);
});
router.put('/v1/patients/:patientId/emergency-contacts/:contactId', verifyPatientId, function (request, response) {
  return patientsController.updateEmergencyContactOfPatient(request, response);
});
router["delete"]('/v1/patients/:patientId/doctors/:doctorId', verifyPatientId, verifyDoctorId, function (request, response) {
  return patientsController.deleteDoctorFromPatient(request, response);
});
module.exports = router;