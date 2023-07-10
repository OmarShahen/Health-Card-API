const router = require('express').Router()
const usersController = require('../controllers/users')
const { verifyUserId } = require('../middlewares/verify-routes-params')
const authorization = require('../middlewares/verify-permission')


router.get(
    '/v1/users/:userId',
    authorization.allPermission, 
    verifyUserId, 
    (request, response) => usersController.getUser(request, response)
)

router.get(
    '/v1/users/:userId/speciality',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.getUserSpeciality(request, response)
)

router.put(
    '/v1/users/:userId',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUser(request, response)
)

router.put(
    '/v1/users/:userId/speciality',
    authorization.allPermission, 
    verifyUserId, 
    (request, response) => usersController.updateUserSpeciality(request, response)
)

router.patch(
    '/v1/users/:userId/email',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserEmail(request, response)
)

router.patch(
    '/v1/users/:userId/password',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.updateUserPassword(request, response)
)

router.patch(
    '/v1/users/:userId/password/verify',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.verifyAndUpdateUserPassword(request, response)
)

router.delete(
    '/v1/users/:userId',
    authorization.allPermission,
    verifyUserId, 
    (request, response) => usersController.deleteUser(request, response)
)

router.patch(
    '/v1/users/:userId/clinics',
    authorization.allPermission,
    verifyUserId,
    (request, response) => usersController.registerStaffToClinic(request, response)
)

router.get(
    '/v1/users/:userId/mode',
    authorization.allPermission,
    verifyUserId,
    (request, response) => usersController.getUserMode(request, response)
)

module.exports = router