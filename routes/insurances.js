const router = require('express').Router()
const insurancesController = require('../controllers/insurances')
const { verifyInsuranceId, verifyClinicId, verifyUserId } = require('../middlewares/verify-routes-params')
const { verifyClinicInvoices } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/insurances', 
    authorization.allPermission,
    (request, response) => insurancesController.getInsurances(request, response)
)

router.get(
    '/v1/insurances/:insuranceId',
    authorization.allPermission,
    verifyInsuranceId,
    (request, response) => insurancesController.getInsurance(request, response)
)

router.get(
    '/v1/insurances/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => insurancesController.getInsurancesByClinicId(request, response)
)

router.get(
    '/v1/insurances/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => insurancesController.getInsurancesByOwnerId(request, response)
)

router.post(
    '/v1/insurances',
    authorization.allPermission,
    (request, response) => insurancesController.addInsurance(request, response)
)

router.delete(
    '/v1/insurances/:insuranceId',
    authorization.allPermission,
    verifyInsuranceId,
    (request, response) => insurancesController.deleteInsurance(request, response)
)

router.put(
    '/v1/insurances/:insuranceId',
    authorization.allPermission,
    verifyInsuranceId,
    (request, response) => insurancesController.updateInsurance(request, response)
)

module.exports = router