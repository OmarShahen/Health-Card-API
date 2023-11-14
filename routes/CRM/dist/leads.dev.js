"use strict";

var router = require('express').Router();

var leadsController = require('../../controllers/CRM/leads');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyLeadId = _require.verifyLeadId;

router.get('/v1/crm/leads', authorization.allPermission, function (request, response) {
  return leadsController.getLeads(request, response);
});
router.get('/v1/crm/leads/:leadId', authorization.allPermission, verifyLeadId, function (request, response) {
  return leadsController.getLeadById(request, response);
});
router.get('/v1/crm/leads/name/search', authorization.allPermission, function (request, response) {
  return leadsController.searchLeads(request, response);
});
router.post('/v1/crm/leads', authorization.allPermission, function (request, response) {
  return leadsController.addLead(request, response);
});
router.put('/v1/crm/leads/:leadId', authorization.allPermission, verifyLeadId, function (request, response) {
  return leadsController.updateLead(request, response);
});
router["delete"]('/v1/crm/leads/:leadId', authorization.allPermission, verifyLeadId, function (request, response) {
  return leadsController.deleteLead(request, response);
});
module.exports = router;