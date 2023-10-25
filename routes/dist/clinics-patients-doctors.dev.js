"use strict";

var router = require('express').Router();

var clinicsPatientsDoctorsController = require('../controllers/clinics-patients-doctors');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicPatientDoctorId = _require.verifyClinicPatientDoctorId,
    verifyUserId = _require.verifyUserId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicPatients = _require2.verifyClinicPatients;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/clinics-patients-doctors', authorization.allPermission, function (request, response) {
  return clinicsPatientsDoctorsController.getClinicsPatientsDoctors(request, response);
});
router.get('/v1/clinics-patients-doctors/doctors/:userId/search', authorization.allPermission, verifyUserId, function (request, response) {
  return clinicsPatientsDoctorsController.searchDoctorsPatients(request, response);
});
router.post('/v1/clinics-patients-doctors', authorization.allPermission, function (request, response) {
  return clinicsPatientsDoctorsController.addClinicPatientDoctor(request, response);
});
router.post('/v1/clinics-patients-doctors/card-ID', authorization.allPermission, verifyClinicPatients, function (request, response) {
  return clinicsPatientsDoctorsController.addClinicPatientDoctorByCardId(request, response);
});
router["delete"]('/v1/clinics-patients-doctors/:clinicPatientDoctorId', authorization.allPermission, verifyClinicPatientDoctorId, function (request, response) {
  return clinicsPatientsDoctorsController.deleteClinicPatientDoctor(request, response);
});
module.exports = router;