"use strict";

var router = require('express').Router();

var messagesSentController = require('../../controllers/CRM/messagesSent');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyMessageSentId = _require.verifyMessageSentId;

router.get('/v1/crm/messages-sent', authorization.allPermission, function (request, response) {
  return messagesSentController.getMessagesSent(request, response);
});
router.post('/v1/crm/messages-sent', authorization.allPermission, function (request, response) {
  return messagesSentController.addMessageSent(request, response);
});
router["delete"]('/v1/crm/messages-sent/:messageSentId', authorization.allPermission, verifyMessageSentId, function (request, response) {
  return messagesSentController.deleteMessageSent(request, response);
});
router.patch('/v1/crm/messages-sent/:messageSentId/cta', authorization.allPermission, verifyMessageSentId, function (request, response) {
  return messagesSentController.updateMessageSentCTA(request, response);
});
router.patch('/v1/crm/messages-sent/:messageSentId/open', authorization.allPermission, verifyMessageSentId, function (request, response) {
  return messagesSentController.updateMessageSentOpen(request, response);
});
router.patch('/v1/crm/messages-sent/:messageSentId/respond', authorization.allPermission, verifyMessageSentId, function (request, response) {
  return messagesSentController.updateMessageSentRespond(request, response);
});
module.exports = router;