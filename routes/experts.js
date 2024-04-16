const router = require('express').Router()
const expertsController = require('../controllers/experts')
const { verifySpecialityId, verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')

router.put(
    '/v1/experts/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.updateExpert(request, response)
)

router.get(
    '/v1/experts/specialities/:specialityId',
    verifySpecialityId, 
    (request, response) => expertsController.searchExperts(request, response)
)

router.get(
    '/v1/experts/specialities/:specialityId/name/:name',
    verifySpecialityId, 
    (request, response) => expertsController.searchExpertsByNameAndSpeciality(request, response)
)

router.post(
    '/v1/experts',
    authorization.allPermission,
    (request, response) => expertsController.addExpert(request, response)
)

router.get(
    '/v1/experts',
    authorization.allPermission,
    (request, response) => expertsController.getExperts(request, response)
)

router.get(
    '/v1/experts/name/search',
    authorization.allPermission,
    (request, response) => expertsController.searchExpertsByName(request, response)
)

router.delete(
    '/v1/experts/:userId',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.deleteExpert(request, response)
)

router.patch(
    '/v1/experts/:userId/bank-info',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.addExpertBankInfo(request, response)
)

router.patch(
    '/v1/experts/:userId/mobile-wallet',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.addExpertMobileWalletInfo(request, response)
)

router.patch(
    '/v1/experts/:userId/onboarding',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.updateExpertOnBoarding(request, response)
)

router.patch(
    '/v1/experts/:userId/promo-codes-acceptance',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.updateExpertPromoCodeAcceptance(request, response)
)

router.patch(
    '/v1/experts/:userId/online',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.updateExpertOnlineStatus(request, response)
)

router.patch(
    '/v1/experts/:userId/subscription',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.updateExpertSubscription(request, response)
)

router.get(
    '/v1/experts/:userId/profile-completion-percentage',
    authorization.allPermission,
    verifyUserId,
    (request, response) => expertsController.getExpertProfileCompletionPercentage(request, response)
)

module.exports = router