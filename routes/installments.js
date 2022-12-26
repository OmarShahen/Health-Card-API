const router = require('express').Router()
const tokenMiddleware = require('../middlewares/verify-permission')
const verifyIds = require('../middlewares/verify-routes-params')
const installmentsController = require('../controllers/installments')

router.post(
    '/installments/registrations/:registrationId', 
    tokenMiddleware.appUsersPermission, 
    verifyIds.verifyRegistrationId,
    (request, response) => installmentsController.addInstallment(request, response)
)

router.get(
    '/installments/clubs/:clubId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyClubId,
    (request, response) => installmentsController.getClubInstallments(request, response)
)

router.get(
    '/installments/registrations/:registrationId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyRegistrationId,
    (request, response) => installmentsController.getRegistrationInstallments(request, response)
)


router.delete(
    '/installments/:installmentId',
    tokenMiddleware.appUsersPermission,
    verifyIds.verifyInstallmentId,
    (request, response) => installmentsController.deleteInstallment(request, response)
)

module.exports = router