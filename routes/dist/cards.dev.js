"use strict";

var router = require('express').Router();

var cardsController = require('../controllers/cards');

var authorization = require('../middlewares/verify-permission');

var _require = require('../middlewares/verify-routes-params'),
    verifyCardId = _require.verifyCardId;

router.get('/v1/cards', authorization.allPermission, function (request, response) {
  return cardsController.getCards(request, response);
});
router.post('/v1/cards', authorization.allPermission, function (request, response) {
  return cardsController.addCard(request, response);
});
router.patch('/v1/cards/:cardId/activity', authorization.allPermission, verifyCardId, function (request, response) {
  return cardsController.updateCardActivity(request, response);
});
router["delete"]('/v1/cards/:cardId', authorization.allPermission, verifyCardId, function (request, response) {
  return cardsController.deleteCard(request, response);
});
module.exports = router;