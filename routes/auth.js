const router = require('express').Router()
const authController = require('../controllers/auth')
const tokenMiddleware = require('../middlewares/verify-permission')

router.post('/admins/login', (request, response) => authController.adminLogin(request, response))

router.post('/staffs/login', (request, response) => authController.staffLogin(request, response))

router.post('/clubs-admins/login', (request, response) => authController.clubAdminLogin(request, response))

router.post('/chains-owners/login', (request, response) => authController.chainOwnerLogin(request, response))

router.post('/reset-password/mail/staff', (request, response) => authController.sendStaffResetPasswordMail(request, response))

router.post('/reset-password/mail/chain-owner', (request, response) => authController.sendChainOwnerResetPasswordMail(request, response))

router.post('/members/:memberId/language/:languageCode/whatsapp/verification', (request, response) => authController.sendMemberQRCodeWhatsapp(request, response))

router.post('/verify-token', (request, response) => authController.verifyToken(request, response))

router.patch('/reset-password', tokenMiddleware.verifyToken, (request, response) => authController.resetPassword(request, response))

module.exports = router