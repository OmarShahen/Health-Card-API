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
    tokenMiddleware.appUsersPermission,
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
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyMemberId, 
    (request, response) => membersController.deleteMemberAndRelated(request, response)
)

router.get(
    '/members/clubs/:clubId', 
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId, 
    (request, response) => membersController.getMembers(request, response)
)

router.get(
    '/members/clubs/:clubId/stats', 
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId, 
    (request, response) => membersController.getClubMembersStatsByDate(request, response)
)

router.get(
    '/members/:memberId/stats', 
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyMemberId, 
    (request, response) => membersController.getMemberStatsByDate(request, response)
)

router.patch(
    '/members/:memberId/QR-code', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyMemberId, 
    (request, response) => membersController.updateMemberQRcodeVerification(request, response)
)

router.post(
    '/members/:memberId/language/:languageCode/whatsapp/verification', 
    tokenMiddleware.appUsersPermission,
    (request, response) => membersController.sendMemberQRCodeWhatsapp(request, response)
)


router.patch(
    '/members/:memberId/authentication',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyMemberId,
    (request, response) => membersController.updateMemberAuthenticationStatus(request, response)
)

router.get(
    '/members/chain-owners/:ownerId', 
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => membersController.getMembersByOwner(request, response)
)

router.get(
    '/members/chain-owners/:ownerId/stats', 
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => membersController.getChainOwnerMembersStatsByDate(request, response)
)

router.post(
    '/members/insert-many', 
    tokenMiddleware.adminPermission,
    (request, response) => membersController.insertManyMembers(request, response)
)

router.patch(
    '/members/:memberId/notes',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyMemberId,
    (request, response) => membersController.addNoteToMember(request, response)
)

router.patch(
    '/members/:memberId/blacklist',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyMemberId,
    (request, response) => membersController.memberBlacklistStatus(request, response)
)

router.delete(
    '/members/:memberId/notes/:noteId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyMemberId,
    (request, response) => membersController.removeNoteFromMember(request, response)
)

router.post(
    '/members/clubs/:clubId/import',
    verifyIds.verifyClubId,
    (request, response) => membersController.exportClubMembersThirdParty(request, response)
)

module.exports = router