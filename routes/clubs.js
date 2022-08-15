const router = require('express').Router()
const clubsController = require('../controllers/clubs')

router.post('/clubs', (request, response) => clubsController.addClub(request, response))

router.get('/clubs/names', (request, response) => clubsController.getClubs(request, response))

module.exports = router