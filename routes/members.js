const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const membersController = require('../controllers/members')

router.post('/members', (request, response) => membersController.addMember(request, response))

router.get('/members/clubs/:clubId/search', verifyIds.verifyClubId, (request, response) => membersController.searchMembersByPhone(request, response))

router.delete('/members/:memberId', verifyIds.verifyMemberId, (request, response) => membersController.deleteMember(request, response))

router.put('/members/:memberId', verifyIds.verifyMemberId, (request, response) => membersController.updateMember(request, response))

router.patch('/members/:memberId', verifyIds.verifyMemberId, (request, response) => membersController.updateMemberStatus(request, response))

router.delete('/members/:memberId/wild', verifyIds.verifyMemberId, (request, response) => membersController.deleteMemberAndRelated(request, response))

router.get('/members/clubs/:clubId', verifyIds.verifyClubId, (request, response) => membersController.getMembers(request, response))

router.get('/members/clubs/:clubId/stats/:statsDate', verifyIds.verifyClubId, (request, response) => membersController.getMembersStatsByDate(request, response))

router.get('/members/:memberId/stats/:statsDate', verifyIds.verifyMemberId, (request, response) => membersController.getMemberRegistrationsStatsByDate(request, response))

router.patch('/members/:memberId/QR-code', verifyIds.verifyMemberId, (request, response) => membersController.updateMemberQRcodeVerification(request, response))

module.exports = router