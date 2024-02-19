"use strict";

var router = require('express').Router();

var servicesController = require('../controllers/services');

var _require = require('../middlewares/verify-routes-params'),
    verifyServiceId = _require.verifyServiceId,
    verifyUserId = _require.verifyUserId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/services', authorization.allPermission, function (request, response) {
  return servicesController.getServices(request, response);
});
router.get('/v1/services/experts/:userId', verifyUserId, function (request, response) {
  return servicesController.getServicesByExpertId(request, response);
});
router.post('/v1/services', authorization.allPermission, function (request, response) {
  return servicesController.addService(request, response);
});
router.put('/v1/services/:serviceId', authorization.allPermission, verifyServiceId, function (request, response) {
  return servicesController.updateService(request, response);
});
router.patch('/v1/services/:serviceId/activity', authorization.allPermission, verifyServiceId, function (request, response) {
  return servicesController.updateServiceActivity(request, response);
});
router["delete"]('/v1/services/:serviceId', authorization.allPermission, verifyServiceId, function (request, response) {
  return servicesController.deleteService(request, response);
});
module.exports = router;