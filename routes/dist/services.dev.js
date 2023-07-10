"use strict";

var router = require('express').Router();

var servicesController = require('../controllers/services');

var _require = require('../middlewares/verify-routes-params'),
    verifyServiceId = _require.verifyServiceId,
    verifyClinicId = _require.verifyClinicId,
    verifyUserId = _require.verifyUserId;

var _require2 = require('../middlewares/verify-clinic-mode'),
    verifyClinicServices = _require2.verifyClinicServices;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/services', authorization.allPermission, function (request, response) {
  return servicesController.getServices(request, response);
});
router.get('/v1/services/owners/:userId', authorization.allPermission, verifyUserId, function (request, response) {
  return servicesController.getServicesByUserId(request, response);
});
router.get('/v1/services/clinics/:clinicId', authorization.allPermission, verifyClinicId, function (request, response) {
  return servicesController.getServicesByClinicId(request, response);
});
router.post('/v1/services', authorization.allPermission, verifyClinicServices, function (request, response) {
  return servicesController.addService(request, response);
});
router["delete"]('/v1/services/:serviceId', authorization.allPermission, verifyServiceId, function (request, response) {
  return servicesController.deleteService(request, response);
});
router.put('/v1/services/:serviceId', authorization.allPermission, verifyServiceId, function (request, response) {
  return servicesController.updateService(request, response);
});
module.exports = router;