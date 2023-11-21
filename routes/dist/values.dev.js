"use strict";

var router = require('express').Router();

var valuesController = require('../controllers/values');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyValueId = _require.verifyValueId;

router.get('/v1/values', authorization.allPermission, function (request, response) {
  return valuesController.getValues(request, response);
});
router.post('/v1/values', authorization.allPermission, function (request, response) {
  return valuesController.addValue(request, response);
});
router["delete"]('/v1/values/:valueId', authorization.allPermission, verifyValueId, function (request, response) {
  return valuesController.deleteValue(request, response);
});
router.patch('/v1/values/:valueId/value', authorization.allPermission, verifyValueId, function (request, response) {
  return valuesController.updateValueValue(request, response);
});
module.exports = router;