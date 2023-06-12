"use strict";

var router = require('express').Router();

var clinicsPatientsDoctorsController = require('../controllers/clinics-patients-doctors');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicPatientDoctorId = _require.verifyClinicPatientDoctorId;

router.get('/v1/clinics-patients-doctors', function (request, response) {
  return clinicsPatientsDoctorsController.getClinicsPatientsDoctors(request, response);
});
router.post('/v1/clinics-patients-doctors', function (request, response) {
  return clinicsPatientsDoctorsController.addClinicPatientDoctor(request, response);
});
router.post('/v1/clinics-patients-doctors/card-ID', function (request, response) {
  return clinicsPatientsDoctorsController.addClinicPatientDoctorByCardId(request, response);
});
router["delete"]('/v1/clinics-patients-doctors/:clinicPatientDoctorId', verifyClinicPatientDoctorId, function (request, response) {
  return clinicsPatientsDoctorsController.deleteClinicPatientDoctor(request, response);
});
module.exports = router;