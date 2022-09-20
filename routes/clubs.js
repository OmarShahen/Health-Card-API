const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const clubsController = require('../controllers/clubs')

router.post('/clubs', (request, response) => clubsController.addClub(request, response))

router.get('/clubs', (request, response) => clubsController.getClubs(request, response))

router.get('/clubs/:clubId/stats', verifyIds.verifyClubId, (request, response) => clubsController.getClubStatsByDate(request, response))

router.get('/clubs/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => clubsController.getClubsByOwner(request, response))

router.put('/clubs/:clubId', verifyIds.verifyClubId, (request, response) => clubsController.updateClub(request, response))

router.patch('/clubs/:clubId', verifyIds.verifyClubId, (request, response) => clubsController.updateClubStatus(request, response))

router.delete('/clubs/:clubId', verifyIds.verifyClubId, (request, response) => clubsController.deleteClub(request, response))

router.delete('/clubs/:clubId/wild', verifyIds.verifyClubId, (request, response) => clubsController.deleteClubAndRelated(request, response))

module.exports = router