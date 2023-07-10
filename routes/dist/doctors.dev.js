"use strict";

var router = require('express').Router();

var doctorsController = require('../controllers/doctors');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicId = _require.verifyClinicId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/doctors/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return doctorsController.getClinicDoctors(request, response);
});
module.exports = router;