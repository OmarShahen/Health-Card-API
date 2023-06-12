"use strict";

var router = require('express').Router();

var visitReasonsController = require('../controllers/visit-reasons');

var tokenMiddleware = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyVisitReasonId = _require.verifyVisitReasonId;

router.get('/v1/visit-reasons', function (request, response) {
  return visitReasonsController.getVisitReasons(request, response);
});
router.post('/v1/visit-reasons', function (request, response) {
  return visitReasonsController.addVisitReason(request, response);
});
router["delete"]('/v1/visit-reasons/:visitReasonId', verifyVisitReasonId, function (request, response) {
  return visitReasonsController.deleteVisitReason(request, response);
});
router["delete"]('/v1/visit-reasons', function (request, response) {
  return visitReasonsController.deleteVisitReasons(request, response);
});
router.put('/v1/visit-reasons/:visitReasonId', verifyVisitReasonId, function (request, response) {
  return visitReasonsController.updateVisitReason(request, response);
});
module.exports = router;