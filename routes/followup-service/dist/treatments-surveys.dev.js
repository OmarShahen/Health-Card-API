"use strict";

var router = require('express').Router();

var treatmentsSurveysController = require('../../controllers/followup-service/treatments-surveys');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyTreatmentSurveyId = _require.verifyTreatmentSurveyId,
    verifyPatientId = _require.verifyPatientId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

router.get('/v1/treatments-surveys', authorization.allPermission, function (request, response) {
  return treatmentsSurveysController.getTreatmentsSurveys(request, response);
});
router.get('/v1/treatments-surveys/:treatmentSurveyId', authorization.allPermission, verifyTreatmentSurveyId, function (request, response) {
  return treatmentsSurveysController.getTreatmentSurveyById(request, response);
});
router.get('/v1/treatments-surveys/patients/:patientId', authorization.allPermission, verifyPatientId, function (request, response) {
  return treatmentsSurveysController.getTreatmentsSurveysByPatientId(request, response);
});
router.get('/v1/treatments-surveys/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return treatmentsSurveysController.getTreatmentsSurveysByClinicId(request, response);
});
router.post('/v1/treatments-surveys', authorization.allPermission, function (request, response) {
  return treatmentsSurveysController.addTreatmentSurvey(request, response);
});
router.put('/v1/treatments-surveys/:treatmentSurveyId', authorization.allPermission, verifyTreatmentSurveyId, function (request, response) {
  return treatmentsSurveysController.updateTreatmentSurvey(request, response);
});
router["delete"]('/v1/treatments-surveys/:treatmentSurveyId', authorization.allPermission, verifyTreatmentSurveyId, function (request, response) {
  return treatmentsSurveysController.deleteTreatmentSurvey(request, response);
});
module.exports = router;