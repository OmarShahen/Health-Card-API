"use strict";

var router = require('express').Router();

var patientsSurveysController = require('../../controllers/followup-service/patients-surveys');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyPatientSurveyId = _require.verifyPatientSurveyId,
    verifyPatientId = _require.verifyPatientId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

router.get('/v1/patients-surveys', authorization.allPermission, function (request, response) {
  return patientsSurveysController.getPatientsSurveys(request, response);
});
router.get('/v1/patients-surveys/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return patientsSurveysController.getPatientsSurveysByPatientId(request, response);
});
router.get('/v1/patients-surveys/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return patientsSurveysController.getPatientsSurveysByClinicId(request, response);
});
router.get('/v1/patients-surveys/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return patientsSurveysController.getPatientsSurveysByOwnerId(request, response);
});
router.get('/v1/patients-surveys/members/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return patientsSurveysController.getPatientsSurveysByDoneById(request, response);
});
router.get('/v1/patients-surveys/:patientSurveyId', authorization.allPermission, verifyPatientSurveyId, function (request, response) {
  return patientsSurveysController.getPatientSurveyById(request, response);
});
router.post('/v1/patients-surveys', authorization.allPermission, function (request, response) {
  return patientsSurveysController.addPatientSurvey(request, response);
});
router.put('/v1/patients-surveys/:patientSurveyId', authorization.allPermission, verifyPatientSurveyId, function (request, response) {
  return patientsSurveysController.updatePatientSurvey(request, response);
});
router["delete"]('/v1/patients-surveys/:patientSurveyId', authorization.allPermission, verifyPatientSurveyId, function (request, response) {
  return patientsSurveysController.deletePatientSurvey(request, response);
});
module.exports = router;