"use strict";

var router = require('express').Router();

var servicesController = require('../controllers/services');

var _require = require('../middlewares/verify-routes-params'),
    verifyServiceId = _require.verifyServiceId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

router.get('/v1/services', function (request, response) {
  return servicesController.getServices(request, response);
});
router.get('/v1/services/owners/:userId', verifyUserId, function (request, response) {
  return servicesController.getServicesByUserId(request, response);
});
router.get('/v1/services/clinics/:clinicId', verifyClinicId, function (request, response) {
  return servicesController.getServicesByClinicId(request, response);
});
router.post('/v1/services', function (request, response) {
  return servicesController.addService(request, response);
});
router["delete"]('/v1/services/:serviceId', verifyServiceId, function (request, response) {
  return servicesController.deleteService(request, response);
});
router.put('/v1/services/:serviceId', verifyServiceId, function (request, response) {
  return servicesController.updateService(request, response);
});
module.exports = router;