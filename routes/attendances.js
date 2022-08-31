const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const attendancesController = require('../controllers/attendances')

router.post('/attendances', (request, response) => attendancesController.addAttendance(request, response))


module.exports = router