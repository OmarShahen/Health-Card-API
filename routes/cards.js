const router = require('express').Router()
const cardsController = require('../controllers/cards')
const authorization = require('../middlewares/verify-permission')
const { verifyCardId } = require('../middlewares/verify-routes-params')

router.get(
    '/v1/cards', 
    authorization.allPermission,
    (request, response) => cardsController.getCards(request, response)
)

router.post(
    '/v1/cards',
    authorization.allPermission,
    (request, response) => cardsController.addCard(request, response)
)

router.patch(
    '/v1/cards/:cardId/activity',
    authorization.allPermission,
    verifyCardId,
    (request, response) => cardsController.updateCardActivity(request, response)
)

router.delete(
    '/v1/cards/:cardId',
    authorization.allPermission,
    verifyCardId,
    (request, response) => cardsController.deleteCard(request, response)
)


module.exports = router