const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const registrationsController = require('../controllers/registrations')

router.post(
  '/registrations', 
  //tokenMiddleware.appUsersPermission, 
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
  //tokenMiddleware.appUsersPermission,
  verifyIds.verifyClubId, 
  (request, response) => registrationsController.getRegistrations(request, response)
  )

router.get('/registrations/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => registrationsController.getClubRegistrationsStatsByDate(request, response))

router.post('/registrations/check-data', (request, response) => registrationsController.checkAddRegistrationData(request, response))

router.get('/registrations/clubs/:clubId/data-joined', verifyIds.verifyClubId, (request, response) => registrationsController.getClubRegistrationsDataJoined(request, response))

router.get('/registrations/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => registrationsController.getRegistrationsByOwner(request, response))

router.get('/registrations/chain-owners/:ownerId/stats', verifyIds.verifyChainOwnerId, (request, response) => registrationsController.getChainOwnerRegistrationsStatsByDate(request, response))

router.get('/registrations/clubs/:clubId/staffs/payments', verifyIds.verifyClubId, (request, response) =>registrationsController.getClubStaffsPayments(request, response))

router.get('/registrations/chain-owners/:ownerId/payments', verifyIds.verifyChainOwnerId, (request, response) => registrationsController.getOwnerClubsPayments(request, response))

router.get('/registrations/members/:memberId', (request, response) => registrationsController.getRegistrationsByMember(request, response))

router.get('/registrations/staffs/:staffId', (request, response) => registrationsController.getRegistrationsByStaff(request, response))

router.get('/registrations/packages/:packageId', (request, response) => registrationsController.getRegistrationsByPackage(request, response))

module.exports = router