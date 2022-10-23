const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const membersController = require('../controllers/members')

router.post(
    '/members', 
    tokenMiddleware.appUsersPermission, 
    (request, response) => membersController.addMember(request, response)
    )

router.post(
    '/members/check',
    tokenMiddleware.appUsersPermission,
    (request, response) => membersController.CheckaddMember(request, response)
     )

router.get(
    '/members/clubs/:clubId/search',
    //tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId, 
    (request, response) => membersController.searchMembersByPhone(request, response)
    )

router.delete(
    '/members/:memberId', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyMemberId, 
    (request, response) => membersController.deleteMember(request, response)
    )

router.put(
    '/members/:memberId', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyMemberId, 
    (request, response) => membersController.updateMember(request, response)
    )

router.patch(
    '/members/:memberId', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyMemberId, 
    (request, response) => membersController.updateMemberStatus(request, response)
    )

router.delete(
    '/members/:memberId/wild', 
    verifyIds.verifyMemberId, 
    (request, response) => membersController.deleteMemberAndRelated(request, response)
    )

router.get(
    '/members/clubs/:clubId', 
    //tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId, 
    (request, response) => membersController.getMembers(request, response)
    )

router.get('/members/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => membersController.getClubMembersStatsByDate(request, response))

router.get('/members/:memberId/stats', verifyIds.verifyMemberId, (request, response) => membersController.getMemberStatsByDate(request, response))

router.patch(
    '/members/:memberId/QR-code', 
    //tokenMiddleware.appUsersPermission, 
    verifyIds.verifyMemberId, 
    (request, response) => membersController.updateMemberQRcodeVerification(request, response)
)

router.post(
    '/members/:memberId/language/:languageCode/whatsapp/verification', 
    (request, response) => membersController.sendMemberQRCodeWhatsapp(request, response)
)


router.patch(
    '/members/:memberId/authentication',
    verifyIds.verifyMemberId,
    (request, response) => membersController.updateMemberAuthenticationStatus(request, response)
)

router.get('/members/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => membersController.getMembersByOwner(request, response))

router.get(
    '/members/chain-owners/:ownerId/stats', 
    verifyIds.verifyChainOwnerId, 
    (request, response) => membersController.getChainOwnerMembersStatsByDate(request, response)
    )

router.post('/members/offline', (request, response) => membersController.uploadNewMembersOffline(request, response))

router.post('/members/insert-many', (request, response) => membersController.insertManyMembers(request, response))

module.exports = router