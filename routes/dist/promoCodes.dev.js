"use strict";

var router = require('express').Router();

var promoCodesController = require('../controllers/promoCodes');

var _require = require('../middlewares/verify-routes-params'),
    verifyPromoCodeId = _require.verifyPromoCodeId;

var authorization = require('../middlewares/verify-permission');

router.get('/v1/promo-codes', authorization.allPermission, function (request, response) {
  return promoCodesController.getPromoCodes(request, response);
});
router.get('/v1/promo-codes/codes/:code', authorization.allPermission, function (request, response) {
  return promoCodesController.getPromoCodeByCode(request, response);
});
router.post('/v1/promo-codes', authorization.allPermission, function (request, response) {
  return promoCodesController.addPromoCode(request, response);
});
router.put('/v1/promo-codes/:promoCodeId', authorization.allPermission, verifyPromoCodeId, function (request, response) {
  return promoCodesController.updatePromoCode(request, response);
});
router.patch('/v1/promo-codes/:promoCodeId/activity', authorization.allPermission, verifyPromoCodeId, function (request, response) {
  return promoCodesController.updatePromoCodeActivity(request, response);
});
router["delete"]('/v1/promo-codes/:promoCodeId', authorization.allPermission, verifyPromoCodeId, function (request, response) {
  return promoCodesController.deletePromoCode(request, response);
});
module.exports = router;