const router = require('express').Router()
const leadsController = require('../../controllers/CRM/leads')
const authorization = require('../../middlewares/verify-permission')
const { verifyLeadId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/crm/leads',
    authorization.allPermission,
    (request, response) => leadsController.getLeads(request, response)
)

router.get(
    '/v1/crm/leads/:leadId',
    authorization.allPermission,
    verifyLeadId,
    (request, response) => leadsController.getLeadById(request, response)
)

router.get(
    '/v1/crm/leads/name/search',
    authorization.allPermission,
    (request, response) => leadsController.searchLeads(request, response)
)

router.get(
    '/v1/crm/leads/status/stages/filter',
    authorization.allPermission,
    (request, response) => leadsController.filterLeads(request, response)
)

router.post(
    '/v1/crm/leads',
    authorization.allPermission,
    (request, response) => leadsController.addLead(request, response)
)

router.put(
    '/v1/crm/leads/:leadId',
    authorization.allPermission,
    verifyLeadId,
    (request, response) => leadsController.updateLead(request, response)
)

router.delete(
    '/v1/crm/leads/:leadId',
    authorization.allPermission,
    verifyLeadId,
    (request, response) => leadsController.deleteLead(request, response)
)


module.exports = router