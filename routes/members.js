const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const membersController = require('../controllers/members')

router.post('/members', (request, response) => membersController.addMember(request, response))

router.get('/members/clubs/:clubId/search', verifyIds.verifyClubId, (request, response) => membersController.searchMembersByPhone(request, response))

module.exports = router