const router = require('express').Router()
const stagesController = require('../../controllers/CRM/stages')
const authorization = require('../../middlewares/verify-permission')
const { verifyStageId, verifyLeadId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/crm/stages',
    authorization.allPermission,
    (request, response) => stagesController.getStages(request, response)
)

router.get(
    '/v1/crm/stages/leads/:leadId',
    authorization.allPermission,
    verifyLeadId,
    (request, response) => stagesController.getStagesByLeadId(request, response)
)

router.post(
    '/v1/crm/stages',
    authorization.allPermission,
    (request, response) => stagesController.addStage(request, response)
)

router.put(
    '/v1/crm/stages/:stageId',
    authorization.allPermission,
    verifyStageId,
    (request, response) => stagesController.updateStage(request, response)
)

router.delete(
    '/v1/crm/stages/:stageId',
    authorization.allPermission,
    verifyStageId,
    (request, response) => stagesController.deleteStage(request, response)
)

module.exports = router