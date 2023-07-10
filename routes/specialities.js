const router = require('express').Router()
const specialitiesController = require('../controllers/specialities')
const { verifySpecialityId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/specialities',
    (request, response) => specialitiesController.getSpecialities(request, response)
)

router.post(
    '/v1/specialities', 
    //authorization.allPermission,
    (request, response) => specialitiesController.addSpeciality(request, response)
)

router.put(
    '/v1/specialities/:specialityId', 
    authorization.allPermission,
    verifySpecialityId, 
    (request, response) => specialitiesController.updateSpeciality(request, response)
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