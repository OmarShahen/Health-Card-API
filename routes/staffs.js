const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const staffsController = require('../controllers/staffs')

router.post(
    '/staffs/club-admin',
    tokenMiddleware.adminAndOwnerPermission,
    (request, response) => staffsController.addClubOwner(request, response)
    )

router.post(
    '/staffs/staff',
    tokenMiddleware.adminAndManagmentPermission,
    (request, response) => staffsController.addStaff(request, response)
    )

router.get(
    '/staffs/clubs/:clubId/roles/staff',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId, 
    (request, response) => staffsController.getStaffs(request, response)
    )

router.get(
    '/staffs/clubs/:clubId/roles/club-admin',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyClubId, (request, response) => staffsController.getClubAdmins(request, response)
    )

router.put(
    '/staffs/:staffId',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyStaffId, (request, response) => staffsController.updateStaff(request, response)
    )

router.delete(
    '/staffs/:staffId',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyStaffId, 
    (request, response) => staffsController.deleteStaff(request, response)
    )

router.patch(
    '/staffs/:staffId',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyStaffId, 
    (request, response) => staffsController.updateStaffStatus(request, response)
    )

router.delete(
    '/staffs/:staffId/wild',
    tokenMiddleware.adminPermission,
    verifyIds.verifyStaffId, 
    (request, response) => staffsController.deleteStaffAndRelated(request, response)
    )

/*router.get(
    '/staffs/:staffId/stats', 
    verifyIds.verifyStaffId, 
    (request, response) => staffsController.getStaffStatsByDate(request, response)
    )*/

router.get(
    '/staffs/chain-owners/:ownerId/role/:role',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => staffsController.getStaffsByOwner(request, response)
)

router.patch(
    '/staffs/:staffId/role', 
    verifyIds.verifyStaffId, 
    (request, response) => staffsController.updateStaffRole(request, response))

module.exports = router