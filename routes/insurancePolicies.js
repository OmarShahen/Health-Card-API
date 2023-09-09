const router = require('express').Router()
const insurancePoliciesController = require('../controllers/insurance-policies')
const { verifyClinicId, verifyUserId, verifyInsurancePolicyId, verifyInsuranceId, verifyPatientId } = require('../middlewares/verify-routes-params')
const { verifyClinicServices } = require('../middlewares/verify-clinic-mode')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/insurance-policies',
    authorization.allPermission,
    (request, response) => insurancePoliciesController.getInsurancePolicies(request, response)
)

router.post(
    '/v1/insurance-policies',
    authorization.allPermission,
    (request, response) => insurancePoliciesController.addInsurancePolicy(request, response)
)

router.get(
    '/v1/insurance-policies/clinics/:clinicId',
    authorization.allPermission,
    verifyClinicId,
    (request, response) => insurancePoliciesController.getInsurancePoliciesByClinicId(request, response)
)

router.get(
    '/v1/insurance-policies/patients/:patientId',
    authorization.allPermission,
    verifyPatientId,
    (request, response) => insurancePoliciesController.getInsurancePoliciesByPatientId(request, response)
)

router.get(
    '/v1/insurance-policies/patients/:patientId/clinics/:clinicId',
    authorization.allPermission,
    verifyPatientId,
    verifyClinicId,
    (request, response) => insurancePoliciesController.getClinicPatientActiveInsurancePolicy(request, response)
)

router.get(
    '/v1/insurance-policies/clinics/:clinicId/patients/:patientId/all',
    authorization.allPermission,
    verifyPatientId,
    verifyClinicId,
    (request, response) => insurancePoliciesController.getClinicInsurancePoliciesByPatientId(request, response)
)

router.get(
    '/v1/insurance-policies/insurances/:insuranceId',
    authorization.allPermission,
    verifyInsuranceId,
    (request, response) => insurancePoliciesController.getInsurancePoliciesByInsuranceCompanyId(request, response)
)

router.get(
    '/v1/insurance-policies/owners/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => insurancePoliciesController.getInsurancePoliciesByOwnerId(request, response)
)

router.delete(
    '/v1/insurance-policies/:insurancePolicyId',
    authorization.allPermission,
    verifyInsurancePolicyId,
    (request, response) => insurancePoliciesController.deleteInsurancePolicy(request, response)
)

router.patch(
    '/v1/insurance-policies/:insurancePolicyId/status',
    authorization.allPermission,
    verifyInsurancePolicyId,
    (request, response) => insurancePoliciesController.updateInsurancePolicyStatus(request, response)
)

router.put(
    '/v1/insurance-policies/:insurancePolicyId',
    authorization.allPermission,
    verifyInsurancePolicyId,
    (request, response) => insurancePoliciesController.updateInsurancePolicy(request, response)
)

module.exports = router