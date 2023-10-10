const router = require('express').Router()
const treatmentsSurveysController = require('../../controllers/followup-service/treatments-surveys')
const authorization = require('../../middlewares/verify-permission')
const { verifyTreatmentSurveyId, verifyPatientId, verifyClinicId, verifyUserId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/treatments-surveys',
    authorization.allPermission,
    (request, response) => treatmentsSurveysController.getTreatmentsSurveys(request, response)
)

router.get(
    '/v1/treatments-surveys/patients/:patientId',
    authorization.allPermission,
    verifyPatientId,
    (request, response) => treatmentsSurveysController.getTreatmentsSurveysByPatientId(request, response)
)

router.get(
    '/v1/treatments-surveys/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => treatmentsSurveysController.getTreatmentsSurveysByClinicId(request, response)
)

router.post(
    '/v1/treatments-surveys',
    authorization.allPermission,
    (request, response) => treatmentsSurveysController.addTreatmentSurvey(request, response)
)

router.put(
    '/v1/treatments-surveys/:treatmentSurveyId',
    authorization.allPermission,
    verifyTreatmentSurveyId,
    (request, response) => treatmentsSurveysController.updateTreatmentSurvey(request, response)
)

router.delete(
    '/v1/treatments-surveys/:treatmentSurveyId',
    authorization.allPermission,
    verifyTreatmentSurveyId,
    (request, response) => treatmentsSurveysController.deleteTreatmentSurvey(request, response)
)

module.exports = router