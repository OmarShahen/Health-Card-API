const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const chainOwnersController = require('../controllers/chainOwner')

router.post('/chain-owners', (request, response) => chainOwnersController.addChainOwner(request, response))

router.get('/chain-owners', (request, response) => chainOwnersController.getChainOwners(request, response))

module.exports = router