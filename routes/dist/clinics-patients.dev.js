"use strict";

var router = require('express').Router();

var clinicsPatientsController = require('../controllers/clinics-patients');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicPatientId = _require.verifyClinicPatientId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicPatients = _require2.verifyClinicPatients;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/clinics-patients', authorization.allPermission, function (request, response) {
  return clinicsPatientsController.getClinicsPatients(request, response);
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
module.exports = router;