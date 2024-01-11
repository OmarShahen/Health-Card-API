"use strict";

var router = require('express').Router();

var doctorsController = require('../controllers/doctors');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicId = _require.verifyClinicId,
    verifySpecialityId = _require.verifySpecialityId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/doctors/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return doctorsController.getClinicDoctors(request, response);
});
router.get('/v1/experts/specialities/:specialityId', verifySpecialityId, function (request, response) {
  return doctorsController.searchExperts(request, response);
});
router.get('/v1/experts/specialities/:specialityId/name/:name', verifySpecialityId, function (request, response) {
  return doctorsController.searchExpertsByNameAndSpeciality(request, response);
});
module.exports = router;