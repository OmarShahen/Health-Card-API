const router = require('express').Router()
const clinicsPatientsDoctorsController = require('../controllers/clinics-patients-doctors')
const { verifyClinicPatientDoctorId } = require('../middlewares/verify-routes-params')

router.get('/v1/clinics-patients-doctors', (request, response) => clinicsPatientsDoctorsController.getClinicsPatientsDoctors(request, response))

router.post('/v1/clinics-patients-doctors', (request, response) => clinicsPatientsDoctorsController.addClinicPatientDoctor(request, response))

router.post(
    '/v1/clinics-patients-doctors/card-ID',
    (request, response) => clinicsPatientsDoctorsController.addClinicPatientDoctorByCardId(request, response)
)

router.delete(
    '/v1/clinics-patients-doctors/:clinicPatientDoctorId',
    verifyClinicPatientDoctorId,
    (request, response) => clinicsPatientsDoctorsController.deleteClinicPatientDoctor(request, response)
)

module.exports = router