const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const attendancesController = require('../controllers/attendances')

router.post('/attendances', (request, response) => attendancesController.addAttendance(request, response))

router.get('/attendances/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => attendancesController.getClubAttendancesStatsByDate(request, response))


module.exports = router