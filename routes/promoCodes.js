const router = require('express').Router()
const promoCodesController = require('../controllers/promoCodes')
const { verifyPromoCodeId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/promo-codes',
    authorization.allPermission,
    (request, response) => promoCodesController.getPromoCodes(request, response)
)

router.get(
    '/v1/promo-codes/codes/:code',
    authorization.allPermission,
    (request, response) => promoCodesController.getPromoCodeByCode(request, response)
)

router.post(
    '/v1/promo-codes',
    authorization.allPermission,
    (request, response) => promoCodesController.addPromoCode(request, response)
)

router.put(
    '/v1/promo-codes/:promoCodeId',
    authorization.allPermission,
    verifyPromoCodeId,
    (request, response) => promoCodesController.updatePromoCode(request, response)
)

router.patch(
    '/v1/promo-codes/:promoCodeId/activity',
    authorization.allPermission,
    verifyPromoCodeId,
    (request, response) => promoCodesController.updatePromoCodeActivity(request, response)
)

router.delete(
    '/v1/promo-codes/:promoCodeId',
    authorization.allPermission,
    verifyPromoCodeId,
    (request, response) => promoCodesController.deletePromoCode(request, response)
)

module.exports = router