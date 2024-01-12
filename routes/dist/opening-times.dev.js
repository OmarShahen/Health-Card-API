"use strict";

var router = require('express').Router();

var openingTimesController = require('../controllers/opening-times');

var _require = require('../middlewares/verify-routes-params'),
    verifyOpeningTimeId = _require.verifyOpeningTimeId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/opening-times', authorization.allPermission, function (request, response) {
  return openingTimesController.getOpeningTimes(request, response);
});
router.get('/v1/opening-times/experts/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return openingTimesController.getOpeningTimesByExpertId(request, response);
});
router.get('/v1/opening-times/experts/:userId/week-days/:weekday', verifyUserId, function (request, response) {
  return openingTimesController.getOpeningTimesByExpertIdAndDay(request, response);
});
router.get('/v1/opening-times/search', authorization.allPermission, function (request, response) {
  return openingTimesController.searchOpeningTimes(request, response);
});
router.post('/v1/opening-times', authorization.allPermission, function (request, response) {
  return openingTimesController.addOpeningTime(request, response);
});
router.put('/v1/opening-times/:openingTimeId', authorization.allPermission, verifyOpeningTimeId, function (request, response) {
  return openingTimesController.updateOpeningTime(request, response);
});
router.patch('/v1/opening-times/:openingTimeId/activity', authorization.allPermission, verifyOpeningTimeId, function (request, response) {
  return openingTimesController.updateOpeningTimeActivityStatus(request, response);
});
router["delete"]('/v1/opening-times/:openingTimeId', authorization.allPermission, verifyOpeningTimeId, function (request, response) {
  return openingTimesController.deleteOpeningTime(request, response);
});
module.exports = router;