"use strict";

var router = require('express').Router();

var patientsSurveysController = require('../../controllers/followup-service/patients-surveys');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyClinicId = _require.verifyClinicId;

router.get('/v1/patients-surveys', authorization.allPermission, function (request, response) {
  return patientsSurveysController.getPatientsSurveys(request, response);
});
module.exports = router;