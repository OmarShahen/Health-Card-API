const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const chainOwnersController = require('../controllers/chainOwner')

router.post('/chain-owners', (request, response) => chainOwnersController.addChainOwner(request, response))

router.get('/chain-owners', (request, response) => chainOwnersController.getChainOwners(request, response))

router.put('/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => chainOwnersController.updateChainOwner(request, response))

router.patch('/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => chainOwnersController.updateChainOwnerStatus(request, response))

router.delete('/chain-owners/:ownerId', verifyIds.verifyChainOwnerId, (request, response) => chainOwnersController.deleteChainOwner(request, response))

router.delete('/chain-owners/:ownerId/wild', verifyIds.verifyChainOwnerId, (request, response) => chainOwnersController.deleteChainOwnerAndRelated(request, response))

router.get('/chain-owners/:ownerId/stats', verifyIds.verifyChainOwnerId, (request, response) => chainOwnersController.getChainOwnerStatsByDate(request, response))

module.exports = router