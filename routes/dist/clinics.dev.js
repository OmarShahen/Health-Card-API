"use strict";

var router = require('express').Router();

var clinicsController = require('../controllers/clinics');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyDoctorId = _require.verifyDoctorId,
    verifyPatientId = _require.verifyPatientId;

router.post('/v1/clinics', function (request, response) {
  return clinicsController.addClinic(request, response);
});
router.get('/v1/clinics', function (request, response) {
  return clinicsController.getClinics(request, response);
});
router.get('/v1/clinics/doctors/:doctorId', verifyDoctorId, function (request, response) {
  return clinicsController.getClinicsByDoctorId(request, response);
});
router.get('/v1/clinics/patients/:patientId', verifyPatientId, function (request, response) {
  return clinicsController.getClinicsByPatientId(request, response);
});
module.exports = router;