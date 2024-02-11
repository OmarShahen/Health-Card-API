const router = require('express').Router()
const specialitiesController = require('../controllers/specialities')
const { verifySpecialityId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/specialities',
    (request, response) => specialitiesController.getSpecialities(request, response)
)

router.get(
    '/v1/specialities/:specialityId',
    authorization.allPermission,
    verifySpecialityId,
    (request, response) => specialitiesController.getSpeciality(request, response)
)

router.get(
    '/v1/specialities/:specialityId/sub-specialities',
    verifySpecialityId,
    (request, response) => specialitiesController.getSubSpecialitiesOfMainSpeciality(request, response)
)

router.post(
    '/v1/specialities', 
    authorization.allPermission,
    (request, response) => specialitiesController.addSpeciality(request, response)
)

router.put(
    '/v1/specialities/:specialityId', 
    authorization.allPermission,
    verifySpecialityId, 
    (request, response) => specialitiesController.updateSpeciality(request, response)
)

router.patch(
    '/v1/specialities/:specialityId/show', 
    authorization.allPermission,
    verifySpecialityId, 
    (request, response) => specialitiesController.updateSpecialityShowStatus(request, response)
)

router.delete(
    '/v1/specialities/:specialityId', 
    authorization.allPermission,
    verifySpecialityId, 
    (request, response) => specialitiesController.deleteSpeciality(request, response)
)

router.delete(
    '/v1/specialities',
    authorization.allPermission,
    (request, response) => specialitiesController.deleteSpecialities(request, response)
)

module.exports = router