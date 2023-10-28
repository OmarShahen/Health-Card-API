const router = require('express').Router()
const meetingsController = require('../../controllers/CRM/meetings')
const authorization = require('../../middlewares/verify-permission')
const { verifyMeetingId } = require('../../middlewares/verify-routes-params')

router.get(
    '/v1/crm/meetings',
    authorization.allPermission,
    (request, response) => meetingsController.getMeetings(request, response)
)

router.post(
    '/v1/crm/meetings',
    authorization.allPermission,
    (request, response) => meetingsController.addMeeting(request, response)
)

router.patch(
    '/v1/crm/meetings/:meetingId/status',
    authorization.allPermission,
    (request, response) => meetingsController.updateMeetingStatus(request, response)
)

router.delete(
    '/v1/crm/meetings/:meetingId',
    authorization.allPermission,
    verifyMeetingId,
    (request, response) => meetingsController.deleteMeeting(request, response)
)

module.exports = router