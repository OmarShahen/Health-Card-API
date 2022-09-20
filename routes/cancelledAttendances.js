const router = require('express').Router()
const cancelledAttendancesController = require('../controllers/cancelledAttendances')
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/cancelled-attendances', (request, response) => cancelledAttendancesController.addCancelAttendance(request, response))

router.get('/cancelled-attendances/clubs/:clubId', verifyIds.verifyClubId, (request, response) => cancelledAttendancesController.getClubCancelledAttendance(request, response))

router.get('/cancelled-attendances/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => cancelledAttendancesController.getCancelledAttendancesByOwner(request, response))

module.exports = router