const router = require('express').Router()
const viewsController = require('../controllers/views')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/views',
    authorization.allPermission,
    (request, response) => viewsController.getViews(request, response)
)

router.post(
    '/v1/views',
    (request, response) => viewsController.addView(request, response)
)

router.get(
    '/v1/views/experts/:userId/growth',
    authorization.allPermission,
    verifyUserId,
    (request, response) => viewsController.getExpertViewsGrowthStats(request, response)
)

router.get(
    '/v1/views/experts/:userId/pages/stats',
    authorization.allPermission,
    verifyUserId,
    (request, response) => viewsController.getExpertPagesStats(request, response)
)

router.get(
    '/v1/views/experts/:userId/stats',
    authorization.allPermission,
    verifyUserId,
    (request, response) => viewsController.getExpertViewsTotal(request, response)
)

module.exports = router