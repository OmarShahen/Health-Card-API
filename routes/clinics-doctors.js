const router = require('express').Router()
const clinicsDoctorsController = require('../controllers/clinics-doctors')
const { verifyClinicDoctorId } = require('../middlewares/verify-routes-params')

router.get('/v1/clinics-doctors', (request, response) => clinicsDoctorsController.getClinicsDoctors(request, response))

router.post('/v1/clinics-doctors', (request, response) => clinicsDoctorsController.addClinicDoctor(request, response))

router.delete(
    '/v1/clinics-doctors/:clinicDoctorId',
    verifyClinicDoctorId,
    (request, response) => clinicsDoctorsController.deleteClinicDoctor(request, response)
)

module.exports = router