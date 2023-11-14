"use strict";

var router = require('express').Router();

var messagesTemplatesController = require('../../controllers/CRM/messagesTemplates');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyMessageTemplateId = _require.verifyMessageTemplateId,
    verifyLeadId = _require.verifyLeadId;

router.get('/v1/crm/messages-templates', authorization.allPermission, function (request, response) {
  return messagesTemplatesController.getMessagesTemplates(request, response);
});
router.post('/v1/crm/messages-templates', authorization.allPermission, function (request, response) {
  return messagesTemplatesController.addMessageTemplate(request, response);
});
router.put('/v1/crm/messages-templates/:messageTemplateId', authorization.allPermission, verifyMessageTemplateId, function (request, response) {
  return messagesTemplatesController.updateMessageTemplate(request, response);
});
router["delete"]('/v1/crm/messages-templates/:messageTemplateId', authorization.allPermission, verifyMessageTemplateId, function (request, response) {
  return messagesTemplatesController.deleteMessageTemplate(request, response);
});
module.exports = router;