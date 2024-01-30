const router = require('express').Router()
const expertVerificationController = require('../controllers/expertVerifications')
const { verifyExpertVerificationId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/experts-verifications',
    authorization.allPermission,
    (request, response) => expertVerificationController.getExpertVerifications(request, response)
)

router.get(
    '/v1/experts-verifications/search/name',
    authorization.allPermission,
    (request, response) => expertVerificationController.searchExpertsVerificationsByName(request, response)
)

router.post(
    '/v1/experts-verifications',
    (request, response) => expertVerificationController.addExpertVerification(request, response)
)

router.patch(
    '/v1/experts-verifications/:expertVerificationId/status',
    authorization.allPermission,
    verifyExpertVerificationId,
    (request, response) => expertVerificationController.updateExpertVerificationStatus(request, response)
)

router.delete(
    '/v1/experts-verifications/:expertVerificationId',
    authorization.allPermission,
    verifyExpertVerificationId,
    (request, response) => expertVerificationController.deleteExpertVerification(request, response)
)

module.exports = router