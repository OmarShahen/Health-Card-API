const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const registrationsController = require('../controllers/registrations')

router.post(
  '/registrations', 
  tokenMiddleware.appUsersPermission, 
  (request, response) => registrationsController.addRegistration(request, response)
  )

router.get(
  '/registrations/clubs/:clubId/members/:memberId', 
  tokenMiddleware.appUsersPermission, 
  verifyIds.verifyClubId, 
  (request, response) => registrationsController.getMemberRegistrations(request, response)
  )

router.patch(
  '/registrations/:registrationId/staffs/:staffId',
  verifyIds.verifyRegistrationId,
  verifyIds.verifyStaffId,
  (request, response) => registrationsController.updateMemberAttendance(request, response)
  )

router.get(
  '/registrations/clubs/:clubId',
  tokenMiddleware.appUsersPermission,
  verifyIds.verifyClubId, 
  (request, response) => registrationsController.getRegistrations(request, response)
  )

router.get('/registrations/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => registrationsController.getClubRegistrationsStatsByDate(request, response))

module.exports = router