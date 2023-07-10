const router = require('express').Router()
const servicesController = require('../controllers/services')
const { verifyServiceId, verifyClinicId, verifyUserId } = require('../middlewares/verify-routes-params')
const { verifyClinicServices } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/services',
    authorization.allPermission,
    (request, response) => servicesController.getServices(request, response)
)

router.get(
    '/v1/services/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => servicesController.getServicesByUserId(request, response)
)

router.get(
    '/v1/services/clinics/:clinicId', 
    authorization.allPermission,
    verifyClinicId, 
    (request, response) => servicesController.getServicesByClinicId(request, response)
)

router.post(
    '/v1/services',
    authorization.allPermission,
    verifyClinicServices,
    (request, response) => servicesController.addService(request, response)
)

router.delete(
    '/v1/services/:serviceId',
    authorization.allPermission,
    verifyServiceId, 
    (request, response) => servicesController.deleteService(request, response)
)

router.put(
    '/v1/services/:serviceId',
    authorization.allPermission,
    verifyServiceId, 
    (request, response) => servicesController.updateService(request, response)
)


module.exports = router