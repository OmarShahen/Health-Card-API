const router = require('express').Router()
const doctorsController = require('../controllers/doctors')
const { verifyClinicId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/doctors/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => doctorsController.getClinicDoctors(request, response)
)

module.exports = router