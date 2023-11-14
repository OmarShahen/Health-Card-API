const router = require('express').Router()
const messagesTemplatesController = require('../../controllers/CRM/messagesTemplates')
const authorization = require('../../middlewares/verify-permission')
const { verifyMessageTemplateId, verifyLeadId } = require('../../middlewares/verify-routes-params')


router.get(
    '/v1/crm/messages-templates',
    authorization.allPermission,
    (request, response) => messagesTemplatesController.getMessagesTemplates(request, response)
)

router.post(
    '/v1/crm/messages-templates',
    authorization.allPermission,
    (request, response) => messagesTemplatesController.addMessageTemplate(request, response)
)

router.put(
    '/v1/crm/messages-templates/:messageTemplateId',
    authorization.allPermission,
    verifyMessageTemplateId,
    (request, response) => messagesTemplatesController.updateMessageTemplate(request, response)
)

router.delete(
    '/v1/crm/messages-templates/:messageTemplateId',
    authorization.allPermission,
    verifyMessageTemplateId,
    (request, response) => messagesTemplatesController.deleteMessageTemplate(request, response)
)

module.exports = router