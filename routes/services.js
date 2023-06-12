const router = require('express').Router()
const servicesController = require('../controllers/services')
const { verifyServiceId, verifyClinicId, verifyUserId } = require('../middlewares/verify-routes-params')

router.get('/v1/services', (request, response) => servicesController.getServices(request, response))

router.get(
    '/v1/services/owners/:userId',
    verifyUserId,
    (request, response) => servicesController.getServicesByUserId(request, response)
)

router.get(
    '/v1/services/clinics/:clinicId', 
    verifyClinicId, 
    (request, response) => servicesController.getServicesByClinicId(request, response)
)

router.post('/v1/services', (request, response) => servicesController.addService(request, response))

router.delete('/v1/services/:serviceId', verifyServiceId, (request, response) => servicesController.deleteService(request, response))

router.put('/v1/services/:serviceId', verifyServiceId, (request, response) => servicesController.updateService(request, response))

module.exports = router