"use strict";

var router = require('express').Router();

var arrivalMethodsController = require('../controllers/arrival-methods');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyArrivalMethodId = _require.verifyArrivalMethodId;

router.get('/v1/arrival-methods', authorization.allPermission, function (request, response) {
  return arrivalMethodsController.getArrivalMethods(request, response);
});
router.post('/v1/arrival-methods', authorization.allPermission, function (request, response) {
  return arrivalMethodsController.addArrivalMethod(request, response);
});
router.put('/v1/arrival-methods/:arrivalMethodId', authorization.allPermission, verifyArrivalMethodId, function (request, response) {
  return arrivalMethodsController.updateArrivalMethod(request, response);
});
router["delete"]('/v1/arrival-methods/:arrivalMethodId', authorization.allPermission, verifyArrivalMethodId, function (request, response) {
  return arrivalMethodsController.deleteArrivalMethod(request, response);
});
module.exports = router;