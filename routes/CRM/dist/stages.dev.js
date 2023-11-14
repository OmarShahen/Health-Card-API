"use strict";

var router = require('express').Router();

var stagesController = require('../../controllers/CRM/stages');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyStageId = _require.verifyStageId,
    verifyLeadId = _require.verifyLeadId;

router.get('/v1/crm/stages', authorization.allPermission, function (request, response) {
  return stagesController.getStages(request, response);
});
router.get('/v1/crm/stages/leads/:leadId', authorization.allPermission, verifyLeadId, function (request, response) {
  return stagesController.getStagesByLeadId(request, response);
});
router.post('/v1/crm/stages', authorization.allPermission, function (request, response) {
  return stagesController.addStage(request, response);
});
router.put('/v1/crm/stages/:stageId', authorization.allPermission, verifyStageId, function (request, response) {
  return stagesController.updateStage(request, response);
});
router["delete"]('/v1/crm/stages/:stageId', authorization.allPermission, verifyStageId, function (request, response) {
  return stagesController.deleteStage(request, response);
});
module.exports = router;