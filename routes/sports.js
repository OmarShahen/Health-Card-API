const router = require('express').Router()
const verifyIds = require('../middlewares/verify-routes-params')
const tokenMiddleware = require('../middlewares/verify-permission')
const sportsControllers = require('../controllers/sports')

router.post(
    '/sports',
    tokenMiddleware.appUsersPermission,
    (request, response) => sportsControllers.addSport(request, response)
)

router.get(
    '/sports',
    tokenMiddleware.appUsersPermission,
    (request, response) => sportsControllers.getSports(request, response)
)

router.delete(
    '/sports/:sport',
    tokenMiddleware.appUsersPermission,
    (request, response) => sportsControllers.deleteSport(request, response)
)

module.exports = router