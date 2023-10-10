"use strict";

var router = require('express').Router();

var labelsController = require('../../controllers/labels/labels');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyLabelId = _require.verifyLabelId;

router.get('/v1/labels', authorization.allPermission, function (request, response) {
  return labelsController.getLabels(request, response);
});
router.post('/v1/labels', authorization.allPermission, function (request, response) {
  return labelsController.addLabel(request, response);
});
router.put('/v1/labels/:labelId', authorization.allPermission, verifyLabelId, function (request, response) {
  return labelsController.updateLabel(request, response);
});
router["delete"]('/v1/labels/:labelId', authorization.allPermission, verifyLabelId, function (request, response) {
  return labelsController.deleteLabel(request, response);
});
module.exports = router;