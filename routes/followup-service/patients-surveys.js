const router = require('express').Router()
const patientsSurveysController = require('../../controllers/followup-service/patients-surveys')
const authorization = require('../../middlewares/verify-permission')
const { verifyPatientSurveyId, verifyPatientId, verifyClinicId, verifyUserId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/patients-surveys',
    authorization.allPermission,
    (request, response) => patientsSurveysController.getPatientsSurveys(request, response)
)

router.get(
    '/v1/patients-surveys/patients/:patientId',
    authorization.allPermission,
    verifyPatientId,
    (request, response) => patientsSurveysController.getPatientsSurveysByPatientId(request, response)
)

router.get(
    '/v1/patients-surveys/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => patientsSurveysController.getPatientsSurveysByClinicId(request, response)
)

router.get(
    '/v1/patients-surveys/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => patientsSurveysController.getPatientsSurveysByOwnerId(request, response)
)

router.get(
    '/v1/patients-surveys/members/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => patientsSurveysController.getPatientsSurveysByDoneById(request, response)
)

router.get(
    '/v1/patients-surveys/:patientSurveyId',
    authorization.allPermission,
    verifyPatientSurveyId,
    (request, response) => patientsSurveysController.getPatientSurveyById(request, response)
)


router.post(
    '/v1/patients-surveys',
    authorization.allPermission,
    (request, response) => patientsSurveysController.addPatientSurvey(request, response)
)

router.put(
    '/v1/patients-surveys/:patientSurveyId',
    authorization.allPermission,
    verifyPatientSurveyId,
    (request, response) => patientsSurveysController.updatePatientSurvey(request, response)
)

router.delete(
    '/v1/patients-surveys/:patientSurveyId',
    authorization.allPermission,
    verifyPatientSurveyId,
    (request, response) => patientsSurveysController.deletePatientSurvey(request, response)
)


module.exports = router