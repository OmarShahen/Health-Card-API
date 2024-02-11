const router = require('express').Router()
const analyticsController = require('../controllers/analytics')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/analytics/overview',
    authorization.allPermission,
    (request, response) => analyticsController.getOverviewAnalytics(request, response)
)

router.get(
    '/v1/analytics/users/growth',
    authorization.allPermission,
    (request, response) => analyticsController.getUsersGrowthStats(request, response)
)



module.exports = router