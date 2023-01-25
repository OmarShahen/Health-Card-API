const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const registrationsController = require('../controllers/registrations')
const { response } = require('express')

router.post(
  '/v1/registrations', 
  tokenMiddleware.appUsersPermission, 
  (request, response) => registrationsController.addRegistration(request, response)
)

router.post(
  '/v1/registrations/custom', 
  tokenMiddleware.appUsersPermission, 
  (request, response) => registrationsController.addCustomRegistration(request, response)
)

router.get(
  '/v1/registrations/clubs/:clubId/members/:memberId', 
  tokenMiddleware.appUsersPermission, 
  verifyIds.verifyClubId,
  verifyIds.verifyMemberId,
  (request, response) => registrationsController.getMemberRegistrations(request, response)
  )

router.patch(
  '/v1/registrations/:registrationId/staffs/:staffId',
  tokenMiddleware.adminAndManagmentPermission,
  verifyIds.verifyRegistrationId,
  verifyIds.verifyStaffId,
  (request, response) => registrationsController.updateMemberAttendance(request, response)
)

router.patch(
  '/v1/registrations/:registrationId/attendance',
  tokenMiddleware.adminPermission,
  verifyIds.verifyRegistrationId,
  (request, response) => registrationsController.updateRegistrationAttendance(request, response)
)

router.get(
  '/v1/registrations/clubs/:clubId',
  tokenMiddleware.appUsersPermission,
  verifyIds.verifyClubId, 
  (request, response) => registrationsController.getClubRegistrations(request, response)
  )

router.get(
  '/v1/registrations/clubs/:clubId/stats',
  tokenMiddleware.adminAndManagmentPermission,
  verifyIds.verifyClubId, 
  (request, response) => registrationsController.getClubRegistrationsStatsByDate(request, response)
  )

router.post(
  '/v1/registrations/check-data',
  tokenMiddleware.appUsersPermission,
  (request, response) => registrationsController.checkAddRegistrationData(request, response)
  )

router.get(
  '/v1/registrations/clubs/:clubId/data-joined',
  tokenMiddleware.appUsersPermission,
  verifyIds.verifyClubId, 
  (request, response) => registrationsController.getClubRegistrationsDataJoined(request, response)
  )

router.get(
  '/v2/registrations/clubs/:clubId/data-joined',
  tokenMiddleware.appUsersPermission,
  verifyIds.verifyClubId, 
  (request, response) => registrationsController.getClubRegistrationsDataJoinedV2(request, response)
)

router.get(
  '/v1/registrations/chain-owners/:ownerId',
  tokenMiddleware.adminAndOwnerPermission,
  verifyIds.verifyChainOwnerId, 
  (request, response) => registrationsController.getRegistrationsByOwner(request, response)
  )

router.get(
  '/v1/registrations/chain-owners/:ownerId/stats',
  tokenMiddleware.adminAndOwnerPermission,
  verifyIds.verifyChainOwnerId, 
  (request, response) => registrationsController.getChainOwnerRegistrationsStatsByDate(request, response)
  )

router.get(
  '/v1/registrations/clubs/:clubId/staffs/payments',
  tokenMiddleware.adminAndManagmentPermission,
  verifyIds.verifyClubId, 
  (request, response) =>registrationsController.getClubStaffsRegistrationsPayments(request, response)
)

router.get(
  '/v2/registrations/clubs/:clubId/staffs/payments',
  tokenMiddleware.adminAndManagmentPermission,
  verifyIds.verifyClubId, 
  (request, response) =>registrationsController.getClubStaffsPayments(request, response)
)



router.get(
  '/v1/registrations/chain-owners/:ownerId/payments',
  tokenMiddleware.adminAndOwnerPermission,
  verifyIds.verifyChainOwnerId, 
  (request, response) => registrationsController.getOwnerClubsPayments(request, response)
  )

router.get(
  '/v1/registrations/members/:memberId',
  tokenMiddleware.appUsersPermission,
  (request, response) => registrationsController.getRegistrationsByMember(request, response)
  )

router.get(
  '/v1/registrations/staffs/:staffId',
  tokenMiddleware.adminAndManagmentPermission,
  verifyIds.verifyStaffId,
  (request, response) => registrationsController.getRegistrationsByStaff(request, response)
  )

router.get(
  '/v1/registrations/packages/:packageId',
  tokenMiddleware.adminAndManagmentPermission,
  (request, response) => registrationsController.getRegistrationsByPackage(request, response)
  )

router.get(
  '/v1/registrations/attendances/members/:memberId',
  tokenMiddleware.appUsersPermission,
  verifyIds.verifyMemberId,
  (request, response) => registrationsController.getRegistrationsAndAttendancesByMember(request, response)
)

router.get(
  '/v1/registrations/clubs/:clubId/installments',
  tokenMiddleware.appUsersPermission,
  verifyIds.verifyClubId,
  (request, response) => registrationsController.getClubRegistrationsWithInstallments(request, response)
)

//router.get('/registrations/chain-owners/:ownerId/staffs/payments', (request, response) => registrationsController.getChainOwnerStaffsPayments(request, response))

router.delete(
  '/v1/registrations/:registrationId',
  tokenMiddleware.adminPermission,
  verifyIds.verifyRegistrationId,
  (request, response) => registrationsController.deleteRegistration(request, response)
)

module.exports = router