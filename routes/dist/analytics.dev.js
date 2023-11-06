"use strict";

var router = require('express').Router();

var analyticsController = require('../controllers/analytics');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId;

router.get('/v1/analytics/overview/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return analyticsController.getOverviewAnalytics(request, response);
});
router.get('/v1/analytics/impressions/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return analyticsController.getImpressionsAnalytics(request, response);
});
router.get('/v1/analytics/treatments/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return analyticsController.getTreatmentsAnalytics(request, response);
});
router.get('/v1/analytics/marketing/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return analyticsController.getMarketingAnalytics(request, response);
});
router.get('/v1/analytics/followup-service/overview', authorization.allPermission, function (request, response) {
  return analyticsController.getFollowupServiceOverviewAnalytics(request, response);
});
module.exports = router;