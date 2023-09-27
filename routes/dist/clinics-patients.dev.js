"use strict";

var router = require('express').Router();

var clinicsPatientsController = require('../controllers/clinics-patients');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicPatientId = _require.verifyClinicPatientId,
    verifyClinicId = _require.verifyClinicId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicPatients = _require2.verifyClinicPatients;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/clinics-patients', authorization.allPermission, function (request, response) {
  return clinicsPatientsController.getClinicsPatients(request, response);
});
router.get('/v1/clinics-patients/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return clinicsPatientsController.getClinicPatientsByClinicId(request, response);
});
router.post('/v1/clinics-patients', authorization.allPermission, verifyClinicPatients, function (request, response) {
  return clinicsPatientsController.addClinicPatient(request, response);
});
router.post('/v1/clinics-patients/card-ID', authorization.allPermission, verifyClinicPatients, function (request, response) {
  return clinicsPatientsController.addClinicPatientByCardId(request, response);
});
router["delete"]('/v1/clinics-patients/:clinicPatientId', authorization.allPermission, verifyClinicPatientId, function (request, response) {
  return clinicsPatientsController.deleteClinicPatient(request, response);
});
router.patch('/v1/clinics-patients/:clinicPatientId/survey', authorization.allPermission, verifyClinicPatientId, function (request, response) {
  return clinicsPatientsController.setClinicPatientSurveyed(request, response);
});
module.exports = router;