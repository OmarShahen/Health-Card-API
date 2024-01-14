const router = require('express').Router()
const seekersController = require('../controllers/seekers')
const { verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/seekers',
    authorization.allPermission,
    (request, response) => seekersController.getSeekers(request, response)
)

router.get(
    '/v1/seekers/name/search',
    authorization.allPermission,
    (request, response) => seekersController.searchSeekersByName(request, response)
)

router.delete(
    '/v1/seekers/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => seekersController.deleteSeeker(request, response)
)

module.exports = router