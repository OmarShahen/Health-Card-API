const router = require('express').Router()
const clinicsController = require('../controllers/clinics')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyDoctorId, verifyPatientId } = require('../middlewares/verify-routes-params')

router.post('/v1/clinics', (request, response) => clinicsController.addClinic(request, response))

router.get('/v1/clinics', (request, response) => clinicsController.getClinics(request, response))

router.get(
    '/v1/clinics/doctors/:doctorId', 
    verifyDoctorId, 
    (request, response) => clinicsController.getClinicsByDoctorId(request, response)
)

router.get(
    '/v1/clinics/patients/:patientId',
    verifyPatientId,
    (request, response) => clinicsController.getClinicsByPatientId(request, response)
)


module.exports = router