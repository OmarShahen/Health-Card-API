const router = require('express').Router()
const authController = require('../controllers/auth')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/v1/auth/doctors/signup', (request, response) => authController.doctorSignup(request, response))

router.post('/v1/auth/doctors/login', (request, response) => authController.doctorLogin(request, response))

module.exports = router