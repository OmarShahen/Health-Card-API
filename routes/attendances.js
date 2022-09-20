const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const attendancesController = require('../controllers/attendances')

router.post('/attendances', (request, response) => attendancesController.addAttendance(request, response))

router.get('/attendances/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => attendancesController.getClubAttendancesStatsByDate(request, response))

router.get(
    '/attendances/registrations/:registrationId/staff', 
    verifyIds.verifyRegistrationId, 
    (request, response) => attendancesController.getRegistrationAttendancesWithStaffData(request, response)
    )

router.get('/attendances/clubs/:clubId', verifyIds.verifyClubId, (request, response) => attendancesController.getClubAttendances(request, response))

router.get('/attendances/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => attendancesController.getAttendancesByOwner(request, response))

router.get('/attendances/chain-owners/:ownerId/stats', verifyIds.verifyChainOwnerId, (request, response) => attendancesController.getChainOwnerAttendancesStatsByDate(request, response))

module.exports = router