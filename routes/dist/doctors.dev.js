"use strict";

var router = require('express').Router();

var doctorsController = require('../controllers/doctors');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyClinicId = _require.verifyClinicId;

router.get('/v1/doctors/clinics/:clinicId', verifyClinicId, function (request, response) {
  return doctorsController.getClinicDoctors(request, response);
});
module.exports = router;