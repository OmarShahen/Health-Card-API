const router = require('express').Router()
const subscriptionsController = require('../controllers/subscriptions')
const authorization = require('../middlewares/verify-permission')
const { verifyClinicId, verifySubscriptionId } = require('../middlewares/verify-routes-params')


router.get(
    '/v1/subscriptions',
    authorization.allPermission, 
    (request, response) => subscriptionsController.getSubscriptions(request, response)
)

router.post(
    '/v1/subscriptions/clinics/:clinicId/subscription-expired',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => subscriptionsController.isClinicHasSubscription(request, response)
)

router.delete(
    '/v1/subscriptions/:subscriptionId',
    authorization.allPermission,
    verifySubscriptionId,
    (request, response) => subscriptionsController.deleteSubscription(request, response)
)


module.exports = router