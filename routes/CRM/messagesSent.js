const router = require('express').Router()
const messagesSentController = require('../../controllers/CRM/messagesSent')
const authorization = require('../../middlewares/verify-permission')
const { verifyMessageSentId } = require('../../middlewares/verify-routes-params')


router.get(
    '/v1/crm/messages-sent',
    authorization.allPermission,
    (request, response) => messagesSentController.getMessagesSent(request, response)
)

router.post(
    '/v1/crm/messages-sent',
    authorization.allPermission,
    (request, response) => messagesSentController.addMessageSent(request, response)
)

router.put(
    '/v1/crm/messages-sent/:messageSentId',
    authorization.allPermission,
    verifyMessageSentId,
    (request, response) => messagesSentController.updateMessageSent(request, response)
)

router.delete(
    '/v1/crm/messages-sent/:messageSentId',
    authorization.allPermission,
    verifyMessageSentId,
    (request, response) => messagesSentController.deleteMessageSent(request, response)
)

router.patch(
    '/v1/crm/messages-sent/:messageSentId/cta',
    authorization.allPermission,
    verifyMessageSentId,
    (request, response) => messagesSentController.updateMessageSentCTA(request, response)
)

router.patch(
    '/v1/crm/messages-sent/:messageSentId/open',
    authorization.allPermission,
    verifyMessageSentId,
    (request, response) => messagesSentController.updateMessageSentOpen(request, response)
)

router.patch(
    '/v1/crm/messages-sent/:messageSentId/respond',
    authorization.allPermission,
    verifyMessageSentId,
    (request, response) => messagesSentController.updateMessageSentRespond(request, response)
)

module.exports = router