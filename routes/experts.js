const router = require('express').Router()
const expertsController = require('../controllers/experts')
const { verifySpecialityId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/experts/specialities/:specialityId',
    verifySpecialityId, 
    (request, response) => expertsController.searchExperts(request, response)
)

router.get(
    '/v1/experts/specialities/:specialityId/name/:name',
    verifySpecialityId, 
    (request, response) => expertsController.searchExpertsByNameAndSpeciality(request, response)
)

module.exports = router