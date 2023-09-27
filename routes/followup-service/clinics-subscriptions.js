const router = require('express').Router()
const clinicsSubscriptionsController = require('../../controllers/followup-service/clinics-subscriptions')
const authorization = require('../../middlewares/verify-permission')
const { verifyClinicSubscriptionId, verifyClinicId } = require('../../middlewares/verify-routes-params')


router.post(
    '/v1/clinics-subscriptions', 
    authorization.allPermission,
    (request, response) => clinicsSubscriptionsController.addClinicSubscription(request, response)
)

router.get(
    '/v1/clinics-subscriptions', 
    authorization.allPermission,
    (request, response) => clinicsSubscriptionsController.getClinicsSubscriptions(request, response)
)

router.get(
    '/v1/clinics-subscriptions/clinics/:clinicId', 
    authorization.allPermission,
    verifyClinicId,
    (request, response) => clinicsSubscriptionsController.getClinicSubscriptions(request, response)
)

router.delete(
    '/v1/clinics-subscriptions/:clinicSubscriptionId', 
    authorization.allPermission,
    verifyClinicSubscriptionId,
    (request, response) => clinicsSubscriptionsController.deleteClinicSubscription(request, response)
)

router.delete(
    '/v1/clinics-subscriptions', 
    authorization.allPermission,
    (request, response) => clinicsSubscriptionsController.deleteClinicsSubscriptions(request, response)
)

router.patch(
    '/v1/clinics-subscriptions/:clinicSubscriptionId/activity', 
    authorization.allPermission,
    verifyClinicSubscriptionId,
    (request, response) => clinicsSubscriptionsController.updateClinicSubscriptionActivity(request, response)
)

module.exports = router