const router = require('express').Router()
const cancelledRegistrationsController = require('../controllers/cancelledRegistrations')
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/cancelled-registrations', (request, response) => cancelledRegistrationsController.addCancelRegistration(request, response))

router.get('/cancelled-registrations/clubs/:clubId', (request, response) => cancelledRegistrationsController.getCancelledRegistrations(request, response))

module.exports = router