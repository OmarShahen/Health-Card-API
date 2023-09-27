const router = require('express').Router()
const patientsSurveysController = require('../../controllers/followup-service/patients-surveys')
const authorization = require('../../middlewares/verify-permission')
const { verifyClinicId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/patients-surveys',
    authorization.allPermission,
    (request, response) => patientsSurveysController.getPatientsSurveys(request, response)
)


module.exports = router