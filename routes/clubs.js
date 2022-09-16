const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const clubsController = require('../controllers/clubs')

router.post('/clubs', (request, response) => clubsController.addClub(request, response))

router.get('/clubs', (request, response) => clubsController.getClubs(request, response))

router.get('/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => clubsController.getClubStatsByDate(request, response))

router.get('/clubs/owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => clubsController.getClubsByOwner(request, response))

module.exports = router