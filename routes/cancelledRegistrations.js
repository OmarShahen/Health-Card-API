const router = require('express').Router()
const cancelledRegistrationsController = require('../controllers/cancelledRegistrations')
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/cancelled-registrations', (request, response) => cancelledRegistrationsController.addCancelRegistration(request, response))


module.exports = router