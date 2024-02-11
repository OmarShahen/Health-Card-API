"use strict";

var router = require('express').Router();

var analyticsController = require('../controllers/analytics');

var authorization = require('../middlewares/verify-permission');

router.get('/v1/analytics/overview', authorization.allPermission, function (request, response) {
  return analyticsController.getOverviewAnalytics(request, response);
});
router.get('/v1/analytics/users/growth', authorization.allPermission, function (request, response) {
  return analyticsController.getUsersGrowthStats(request, response);
});
module.exports = router;