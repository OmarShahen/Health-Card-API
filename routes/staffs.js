const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const staffsController = require('../controllers/staffs')

router.post('/staffs/club-admin', (request, response) => staffsController.addClubOwner(request, response))

router.post('/staffs/staff', (request, response) => staffsController.addStaff(request, response))

router.get('/staffs/clubs/:clubId/roles/staff', verifyIds.verifyClubId, (request, response) => staffsController.getStaffs(request, response))

router.get('/staffs/clubs/:clubId/roles/club-admin', verifyIds.verifyClubId, (request, response) => staffsController.getClubAdmins(request, response))

router.put('/staffs/:staffId', verifyIds.verifyStaffId, (request, response) => staffsController.updateStaff(request, response))

router.delete('/staffs/:staffId', verifyIds.verifyStaffId, (request, response) => staffsController.deleteStaff(request, response))

router.patch('/staffs/:staffId', verifyIds.verifyStaffId, (request, response) => staffsController.updateStaffStatus(request, response))

router.delete('/staffs/:staffId/wild', verifyIds.verifyStaffId, (request, response) => staffsController.deleteStaffAndRelated(request, response))

router.get('/staffs/:staffId/stats', verifyIds.verifyStaffId, (request, response) => staffsController.getStaffStatsByDate(request, response))

router.get('/staffs/chain-owners/:ownerId/role/:role', verifyIds.verifyChainOwnerId, (request, response) => staffsController.getStaffsByOwner(request, response))

module.exports = router