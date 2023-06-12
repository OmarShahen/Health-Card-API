"use strict";

var router = require('express').Router();

var clinicsDoctorsController = require('../controllers/clinics-doctors');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicDoctorId = _require.verifyClinicDoctorId;

router.get('/v1/clinics-doctors', function (request, response) {
  return clinicsDoctorsController.getClinicsDoctors(request, response);
});
router.post('/v1/clinics-doctors', function (request, response) {
  return clinicsDoctorsController.addClinicDoctor(request, response);
});
router["delete"]('/v1/clinics-doctors/:clinicDoctorId', verifyClinicDoctorId, function (request, response) {
  return clinicsDoctorsController.deleteClinicDoctor(request, response);
});
module.exports = router;