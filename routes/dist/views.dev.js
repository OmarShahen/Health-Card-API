"use strict";

var router = require('express').Router();

var viewsController = require('../controllers/views');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyUserId = _require.verifyUserId;

router.get('/v1/views', authorization.allPermission, function (request, response) {
  return viewsController.getViews(request, response);
});
router.post('/v1/views', function (request, response) {
  return viewsController.addView(request, response);
});
router.get('/v1/views/experts/:userId/growth', authorization.allPermission, verifyUserId, function (request, response) {
  return viewsController.getExpertViewsGrowthStats(request, response);
});
router.get('/v1/views/experts/:userId/pages/stats', authorization.allPermission, verifyUserId, function (request, response) {
  return viewsController.getExpertPagesStats(request, response);
});
router.get('/v1/views/experts/:userId/stats', authorization.allPermission, verifyUserId, function (request, response) {
  return viewsController.getExpertViewsTotal(request, response);
});
module.exports = router;