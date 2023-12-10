"use strict";

var router = require('express').Router();

var openingTimesController = require('../controllers/opening-times');

var _require = require('../middlewares/verify-routes-params'),
    verifyOpeningTimeId = _require.verifyOpeningTimeId,
    verifyLeadId = _require.verifyLeadId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/opening-times', authorization.allPermission, function (request, response) {
  return openingTimesController.getOpeningTimes(request, response);
});
router.get('/v1/opening-times/leads/:leadId', authorization.allPermission, verifyLeadId, function (request, response) {
  return openingTimesController.getOpeningTimesByLeadId(request, response);
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
router["delete"]('/v1/opening-times/:openingTimeId', authorization.allPermission, verifyOpeningTimeId, function (request, response) {
  return openingTimesController.deleteOpeningTime(request, response);
});
module.exports = router;