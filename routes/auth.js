const router = require('express').Router()
const authController = require('../controllers/auth')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/admins/login', (request, response) => authController.adminLogin(request, response))

router.post('/staffs/login', (request, response) => authController.staffLogin(request, response))

router.post('/forget-password', (request, response) => authController.sendForgetPasswordMail(request, response))

router.post('/members/:memberId/language/:languageCode/whatsapp/verification', (request, response) => authController.sendMemberQRCodeWhatsapp(request, response))

module.exports = router