"use strict";

var router = require('express').Router();

var clinicsDoctorsController = require('../controllers/clinics-doctors');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicDoctorId = _require.verifyClinicDoctorId,
    verifyUserId = _require.verifyUserId,
    verifyClinicId = _require.verifyClinicId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/clinics-doctors', authorization.allPermission, function (request, response) {
  return clinicsDoctorsController.getClinicsDoctors(request, response);
});
router.get('/v1/clinics-doctors/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsDoctorsController.getClinicsDoctorsByOwnerId(request, response);
});
router.get('/v1/clinics-doctors/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return clinicsDoctorsController.getClinicsDoctorsByClinicId(request, response);
});
router.get('/v1/clinics-doctors/doctors/:userId', verifyUserId, function (request, response) {
  return clinicsDoctorsController.getClinicsDoctorsByDoctorId(request, response);
});
router.post('/v1/clinics-doctors', authorization.allPermission, function (request, response) {
  return clinicsDoctorsController.addClinicDoctor(request, response);
});
router["delete"]('/v1/clinics-doctors/:clinicDoctorId', authorization.allPermission, verifyClinicDoctorId, function (request, response) {
  return clinicsDoctorsController.deleteClinicDoctor(request, response);
});
module.exports = router;