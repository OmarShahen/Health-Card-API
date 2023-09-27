"use strict";

var router = require('express').Router();

var clinicsSubscriptionsController = require('../../controllers/followup-service/clinics-subscriptions');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyClinicSubscriptionId = _require.verifyClinicSubscriptionId,
    verifyClinicId = _require.verifyClinicId;

router.post('/v1/clinics-subscriptions', authorization.allPermission, function (request, response) {
  return clinicsSubscriptionsController.addClinicSubscription(request, response);
});
router.get('/v1/clinics-subscriptions', authorization.allPermission, function (request, response) {
  return clinicsSubscriptionsController.getClinicsSubscriptions(request, response);
});
router.get('/v1/clinics-subscriptions/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return clinicsSubscriptionsController.getClinicSubscriptions(request, response);
});
router["delete"]('/v1/clinics-subscriptions/:clinicSubscriptionId', authorization.allPermission, verifyClinicSubscriptionId, function (request, response) {
  return clinicsSubscriptionsController.deleteClinicSubscription(request, response);
});
router["delete"]('/v1/clinics-subscriptions', authorization.allPermission, function (request, response) {
  return clinicsSubscriptionsController.deleteClinicsSubscriptions(request, response);
});
router.patch('/v1/clinics-subscriptions/:clinicSubscriptionId/activity', authorization.allPermission, verifyClinicSubscriptionId, function (request, response) {
  return clinicsSubscriptionsController.updateClinicSubscriptionActivity(request, response);
});
module.exports = router;