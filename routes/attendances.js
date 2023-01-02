const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const attendancesController = require('../controllers/attendances')

router.post(
    '/attendances',
    tokenMiddleware.appUsersPermission, 
    (request, response) => attendancesController.addAttendance(request, response)
)

router.get(
    '/attendances/clubs/:clubId/stats',
    tokenMiddleware.adminAndManagmentPermission, 
    verifyIds.verifyClubId, (request, response) => attendancesController.getClubAttendancesStatsByDate(request, response)
)

router.get(
    '/attendances/registrations/:registrationId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyRegistrationId, 
    (request, response) => attendancesController.getRegistrationAttendancesWithStaffData(request, response)
)

router.get(
    '/attendances/clubs/:clubId',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId, 
    (request, response) => attendancesController.getClubAttendances(request, response)
)

router.get(
    '/attendances/chain-owners/:ownerId',
    tokenMiddleware.adminAndOwnerPermission, 
    verifyIds.verifyChainOwnerId, 
    (request, response) => attendancesController.getAttendancesByOwner(request, response)
)

router.get(
    '/attendances/chain-owners/:ownerId/stats',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => attendancesController.getChainOwnerAttendancesStatsByDate(request, response)
)

router.post(
    '/attendances/members/:memberId/QRCodes-uuids/:uuid',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyMemberId, 
    (request, response) => attendancesController.addAttendanceByMember(request, response)
)

router.post(
    '/attendances/clubs/:clubId/cards-barcodes/:cardBarcode',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId, 
    (request, response) => attendancesController.addAttendanceByMemberCardBarcode(request, response)
)

module.exports = router