const router = require('express').Router()
const meetingsController = require('../../controllers/CRM/meetings')
const authorization = require('../../middlewares/verify-permission')
const { verifyMeetingId, verifyLeadId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/crm/meetings',
    authorization.allPermission,
    (request, response) => meetingsController.getMeetings(request, response)
)

router.get(
    '/v1/crm/meetings/leads/:leadId',
    authorization.allPermission,
    verifyLeadId,
    (request, response) => meetingsController.getMeetingsByLeadId(request, response)
)

router.post(
    '/v1/crm/meetings',
    authorization.allPermission,
    (request, response) => meetingsController.addMeeting(request, response)
)

router.put(
    '/v1/crm/meetings/:meetingId',
    authorization.allPermission,
    (request, response) => meetingsController.updateMeeting(request, response)
)

router.delete(
    '/v1/crm/meetings/:meetingId',
    authorization.allPermission,
    verifyMeetingId,
    (request, response) => meetingsController.deleteMeeting(request, response)
)

module.exports = router