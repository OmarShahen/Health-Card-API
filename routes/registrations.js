const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const registrationsController = require('../controllers/registrations')

router.post('/registrations', (request, response) => registrationsController.addRegistration(request, response))

router.get('/registrations/clubs/:clubId/members/:memberId', verifyIds.verifyClubId, (request, response) => registrationsController.getMemberRegistrations(request, response))

router.patch('/registrations/:registrationId/staffs/:staffId',
 verifyIds.verifyRegistrationId,
 verifyIds.verifyStaffId,
  (request, response) => registrationsController.updateMemberAttendance(request, response))

router.get('/registrations/clubs/:clubId', (request, response) => registrationsController.getRegistrations(request, response))

module.exports = router