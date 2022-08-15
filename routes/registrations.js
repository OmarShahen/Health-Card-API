const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const registrationsController = require('../controllers/registrations')

router.post('/registrations', (request, response) => registrationsController.addRegistration(request, response))

router.get('/registrations/clubs/:clubId/members/:memberId', verifyIds.verifyClubId, (request, response) => registrationsController.getMemberRegistrations(request, response))

router.patch('/registrations/:registrationId', verifyIds.verifyRegistrationId, (request, response) => registrationsController.updateMemberAttendance(request, response))

module.exports = router