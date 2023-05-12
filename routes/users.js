const router = require('express').Router()
const usersController = require('../controllers/users')
const tokenMiddleware = require('../middlewares/verify-permission')
const { verifyUserId } = require('../middlewares/verify-routes-params')

router.get('/v1/users/:userId', verifyUserId, (request, response) => usersController.getUser(request, response))

router.put('/v1/users/:userId', verifyUserId, (request, response) => usersController.updateUser(request, response))

router.patch('/v1/users/:userId/email', verifyUserId, (request, response) => usersController.updateUserEmail(request, response))

router.patch('/v1/users/:userId/password', verifyUserId, (request, response) => usersController.updateUserPassword(request, response))

module.exports = router