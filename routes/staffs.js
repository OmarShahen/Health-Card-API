const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const staffsController = require('../controllers/staffs')

router.post('/staffs/owners', (request, response) => staffsController.addClubOwner(request, response))

router.post('/staffs/staffs', (request, response) => staffsController.addStaff(request, response))

router.get('/staffs/clubs/:clubId', verifyIds.verifyClubId, (request, response) => staffsController.getStaffs(request, response))

router.put('/staffs/:staffId', verifyIds.verifyStaffId, (request, response) => staffsController.updateStaff(request, response))

router.delete('/staffs/:staffId', verifyIds.verifyStaffId, (request, response) => staffsController.deleteStaff(request, response))

router.patch('/staffs/:staffId', verifyIds.verifyStaffId, (request, response) => staffsController.updateStaffStatus(request, response))

router.delete('/staffs/:staffId/wild', verifyIds.verifyStaffId, (request, response) => staffsController.deleteStaffAndRelated(request, response))

module.exports = router