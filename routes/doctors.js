const router = require('express').Router()
const doctorsController = require('../controllers/doctors')
const { verifyClinicId, verifySpecialityId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/doctors/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => doctorsController.getClinicDoctors(request, response)
)

router.get(
    '/v1/experts/specialities/:specialityId',
    verifySpecialityId, 
    (request, response) => doctorsController.searchExperts(request, response)
)

router.get(
    '/v1/experts/specialities/:specialityId/name/:name',
    verifySpecialityId, 
    (request, response) => doctorsController.searchExpertsByNameAndSpeciality(request, response)
)

module.exports = router