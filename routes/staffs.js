const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const staffsController = require('../controllers/staffs')

router.post('/staffs/owners', (request, response) => staffsController.addClubOwner(request, response))

router.post('/staffs/staffs', (request, response) => staffsController.addStaff(request, response))

module.exports = router