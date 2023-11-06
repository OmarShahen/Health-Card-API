const router = require('express').Router()
const analyticsController = require('../controllers/analytics')
const authorization = require('../middlewares/verify-permission')
const { verifyUserId } = require('../middlewares/verify-routes-params')

router.get(
    '/v1/analytics/overview/owners/:userId', 
    authorization.allPermission,
    verifyUserId,
    (request, response) => analyticsController.getOverviewAnalytics(request, response)
)

router.get(
    '/v1/analytics/impressions/owners/:userId', 
    authorization.allPermission,
    verifyUserId,
    (request, response) => analyticsController.getImpressionsAnalytics(request, response)
)

router.get(
    '/v1/analytics/treatments/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => analyticsController.getTreatmentsAnalytics(request, response)
)

router.get(
    '/v1/analytics/marketing/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => analyticsController.getMarketingAnalytics(request, response)
)

router.get(
    '/v1/analytics/followup-service/overview',
    authorization.allPermission,
    (request, response) => analyticsController.getFollowupServiceOverviewAnalytics(request, response)
)


module.exports = router