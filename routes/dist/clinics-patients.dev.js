"use strict";

var router = require('express').Router();

var clinicsPatientsController = require('../controllers/clinics-patients');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicPatientId = _require.verifyClinicPatientId;

router.get('/v1/clinics-patients', function (request, response) {
  return clinicsPatientsController.getClinicsPatients(request, response);
});
router.post('/v1/clinics-patients', function (request, response) {
  return clinicsPatientsController.addClinicPatient(request, response);
});
router.post('/v1/clinics-patients/card-ID', function (request, response) {
  return clinicsPatientsController.addClinicPatientByCardId(request, response);
});
router["delete"]('/v1/clinics-patients/:clinicPatientId', verifyClinicPatientId, function (request, response) {
  return clinicsPatientsController.deleteClinicPatient(request, response);
});
module.exports = router;