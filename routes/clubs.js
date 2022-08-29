const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const clubsController = require('../controllers/clubs')

router.post('/clubs', (request, response) => clubsController.addClub(request, response))

router.get('/clubs/names', (request, response) => clubsController.getClubs(request, response))

router.get('/clubs/:clubId/stats/:statsDate', verifyIds.verifyClubId, (request, response) => clubsController.getClubStatsByDate(request, response))

module.exports = router