const router = require('express').Router()
const authController = require('../controllers/auth')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/v1/auth/signup', (request, response) => authController.doctorSignup(request, response))

router.post('/v1/auth/login', (request, response) => authController.doctorLogin(request, response))

module.exports = router