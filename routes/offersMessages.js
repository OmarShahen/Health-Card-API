const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const offersMessagesController = require('../controllers/offersMessages')

router.get(
    '/offers-messages/clubs/:clubId',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId,
    (request, response) => offersMessagesController.getClubOffersMessages(request, response)
)

router.post(
    '/offers-messages/clubs/:clubId',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId,
    (request, response) =>  offersMessagesController.addOfferMessage(request, response)  
)

router.delete(
    '/offers-messages/:offerMessageId',
    tokenMiddleware.adminAndManagmentPermission,
    (request, response) => offersMessagesController.deleteOfferMessage(request, response)
)

router.put(
    '/offers-messages/:offerMessageId',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyOfferMessageId,
    (request, response) => offersMessagesController.updateOfferMessage(request, response)
)

router.post(
    '/offers-messages/members/:memberId/send',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyMemberId,
    (request, response) => offersMessagesController.sendOfferMessageToMember(request, response)
)

router.post(
    '/offers-messages/clubs/:clubId/members/send',
    tokenMiddleware.adminAndManagmentPermission,
    verifyIds.verifyClubId,
    (request, response) => offersMessagesController.sendOfferMessageToMembers(request, response)
)

module.exports = router