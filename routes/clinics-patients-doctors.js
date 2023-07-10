const router = require('express').Router()
const clinicsPatientsDoctorsController = require('../controllers/clinics-patients-doctors')
const { verifyClinicPatientDoctorId } = require('../middlewares/verify-routes-params')
const { verifyClinicPatients } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/clinics-patients-doctors',
    authorization.allPermission,
    (request, response) => clinicsPatientsDoctorsController.getClinicsPatientsDoctors(request, response)
)

router.post(
    '/v1/clinics-patients-doctors', 
    authorization.allPermission,
    (request, response) => clinicsPatientsDoctorsController.addClinicPatientDoctor(request, response)
)

router.post(
    '/v1/clinics-patients-doctors/card-ID',
    authorization.allPermission,
    verifyClinicPatients,
    (request, response) => clinicsPatientsDoctorsController.addClinicPatientDoctorByCardId(request, response)
)

router.delete(
    '/v1/clinics-patients-doctors/:clinicPatientDoctorId',
    authorization.allPermission,
    verifyClinicPatientDoctorId,
    (request, response) => clinicsPatientsDoctorsController.deleteClinicPatientDoctor(request, response)
)

module.exports = router