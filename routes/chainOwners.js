const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const chainOwnersController = require('../controllers/chainOwner')
const tokenMiddleware = require('../middlewares/verify-permission')


router.post(
    '/chain-owners',
    tokenMiddleware.adminPermission,
    (request, response) => chainOwnersController.addChainOwner(request, response))

router.get(
    '/chain-owners',
    tokenMiddleware.adminPermission,
    (request, response) => chainOwnersController.getChainOwners(request, response))

router.put(
    '/chain-owners/:ownerId',
    tokenMiddleware.adminPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => chainOwnersController.updateChainOwner(request, response))

router.patch(
    '/chain-owners/:ownerId',
    tokenMiddleware.adminPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => chainOwnersController.updateChainOwnerStatus(request, response))

router.delete(
    '/chain-owners/:ownerId',
    tokenMiddleware.adminPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => chainOwnersController.deleteChainOwner(request, response))

router.delete(
    '/chain-owners/:ownerId/wild',
    tokenMiddleware.adminPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => chainOwnersController.deleteChainOwnerAndRelated(request, response))

router.get(
    '/chain-owners/:ownerId/stats',
    tokenMiddleware.adminAndOwnerPermission,
    verifyIds.verifyChainOwnerId, 
    (request, response) => chainOwnersController.getChainOwnerStatsByDate(request, response))

module.exports = router