const router = require('express').Router()
const servicesController = require('../controllers/services')
const { verifyServiceId, verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/services',
    authorization.allPermission,
    (request, response) => servicesController.getServices(request, response)
)

router.get(
    '/v1/services/experts/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => servicesController.getServicesByExpertId(request, response)
)

router.post(
    '/v1/services',
    authorization.allPermission,
    (request, response) => servicesController.addService(request, response)
)

router.put(
    '/v1/services/:serviceId',
    authorization.allPermission,
    verifyServiceId,
    (request, response) => servicesController.updateService(request, response)
)

router.patch(
    '/v1/services/:serviceId/activity',
    authorization.allPermission,
    verifyServiceId,
    (request, response) => servicesController.updateServiceActivity(request, response)
)


router.delete(
    '/v1/services/:serviceId',
    authorization.allPermission,
    verifyServiceId,
    (request, response) => servicesController.deleteService(request, response)
)

module.exports = router