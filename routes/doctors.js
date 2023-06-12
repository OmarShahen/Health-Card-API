const router = require('express').Router()
const doctorsController = require('../controllers/doctors')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyClinicId } = require('../middlewares/verify-routes-params')

router.get('/v1/doctors/clinics/:clinicId', verifyClinicId, (request, response) => doctorsController.getClinicDoctors(request, response))

module.exports = router