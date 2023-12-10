"use strict";

var router = require('express').Router();

var meetingsController = require('../../controllers/CRM/meetings');

var authorization = require('../../middlewares/verify-permission');

var _require = require('../../middlewares/verify-routes-params'),
    verifyMeetingId = _require.verifyMeetingId,
    verifyLeadId = _require.verifyLeadId;

router.get('/v1/crm/meetings', authorization.allPermission, function (request, response) {
  return meetingsController.getMeetings(request, response);
});
router.get('/v1/crm/meetings/leads/:leadId', authorization.allPermission, verifyLeadId, function (request, response) {
  return meetingsController.getMeetingsByLeadId(request, response);
});
router.post('/v1/crm/meetings', authorization.allPermission, function (request, response) {
  return meetingsController.addMeeting(request, response);
});
router.put('/v1/crm/meetings/:meetingId', authorization.allPermission, function (request, response) {
  return meetingsController.updateMeeting(request, response);
});
router["delete"]('/v1/crm/meetings/:meetingId', authorization.allPermission, verifyMeetingId, function (request, response) {
  return meetingsController.deleteMeeting(request, response);
});
module.exports = router;